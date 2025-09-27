"""Supabase utility: email/password + anonymous auth; Google OAuth removed."""

import os, json, time, secrets, logging
from typing import Dict, Any, List
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    from sentence_transformers import SentenceTransformer
except Exception:
    SentenceTransformer = None


class RoommateVectorDB:

    def __init__(self):
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_ANON_KEY')
        if not self.supabase_url or not self.supabase_key:
            raise ValueError('Missing SUPABASE_URL / SUPABASE_ANON_KEY')
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)

        self.embeddings_available = False
        self.model = None
        if SentenceTransformer:
            try:
                self.model = SentenceTransformer('all-MiniLM-L6-v2')
                self.embeddings_available = True
            except Exception as e:
                logger.warning(f'Embedding model load failed: {e}')

    # -------- Auth --------
    def sign_up_with_email(self, email: str, password: str, full_name: str='') -> Dict[str, Any]:
        try:
            resp = self.supabase.auth.sign_up({'email': email, 'password': password, 'options': {'data': {'full_name': full_name}}})
            user = getattr(resp, 'user', None)
            session = getattr(resp, 'session', None)
            if not user:
                return {'success': False, 'error': 'Email confirmation required or invalid signup'}
            user_data = {'id': user.id, 'email': user.email, 'name': user.user_metadata.get('full_name', ''), 'avatar_url': user.user_metadata.get('avatar_url', ''), 'provider': 'email'}
            self.create_user_profile(user_data)
            sess = None
            if session:
                sess = {'access_token': session.access_token, 'refresh_token': session.refresh_token, 'expires_at': session.expires_at}
            return {'success': True, 'user': user_data, 'session': sess}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def sign_in_with_email(self, email: str, password: str) -> Dict[str, Any]:
        try:
            resp = self.supabase.auth.sign_in_with_password({'email': email, 'password': password})
            user = getattr(resp, 'user', None)
            session = getattr(resp, 'session', None)
            if not user or not session:
                return {'success': False, 'error': 'Invalid credentials'}
            user_data = {'id': user.id, 'email': user.email, 'name': user.user_metadata.get('full_name', ''), 'avatar_url': user.user_metadata.get('avatar_url', ''), 'provider': 'email'}
            self.create_user_profile(user_data)
            sess = {'access_token': session.access_token, 'refresh_token': session.refresh_token, 'expires_at': session.expires_at}
            return {'success': True, 'user': user_data, 'session': sess}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def sign_in_anonymous(self) -> Dict[str, Any]:
        try:
            # Try SDK anonymous methods first
            for m in ['sign_in_anonymously', 'sign_in_anonymous', 'sign_in_with_anon']:
                if hasattr(self.supabase.auth, m):
                    try:
                        resp = getattr(self.supabase.auth, m)()
                        session = getattr(resp, 'session', None)
                        user = getattr(resp, 'user', None)
                        if session:
                            anon_id = user.id if user else f"anon_{secrets.token_hex(8)}"
                            user_data = {'id': anon_id, 'email': None, 'name': 'Anonymous User', 'avatar_url': '', 'provider': 'anonymous'}
                            sess = {'access_token': session.access_token, 'refresh_token': session.refresh_token, 'expires_at': session.expires_at}
                            return {'success': True, 'user': user_data, 'session': sess}
                    except Exception:
                        continue
            
            # Fallback: create a local anonymous session (no real Supabase session)
            anon_id = f"anon_{secrets.token_hex(12)}"
            fake_token = f"anon_token_{secrets.token_hex(16)}"
            user_data = {'id': anon_id, 'email': None, 'name': 'Anonymous User', 'avatar_url': '', 'provider': 'anonymous'}
            sess = {'access_token': fake_token, 'refresh_token': None, 'expires_at': int(time.time()) + 86400}
            logger.warning('Using local anonymous session fallback (no Supabase session)')
            return {'success': True, 'user': user_data, 'session': sess}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def sign_out(self) -> Dict[str, Any]:
        try:
            self.supabase.auth.sign_out()
            return {'success': True, 'message': 'Signed out'}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    # -------- Embeddings (optional) --------
    def _embed(self, text: str) -> List[float]:
        if self.embeddings_available and self.model and text:
            return self.model.encode(text).tolist()
        return []

    # -------- Upload helpers --------
    def upload_profile(self, profile: Dict[str, Any]) -> Dict[str, Any]:
        try:
            emb = self._embed(profile.get('raw_profile_text', ''))
            rec = { **profile }
            if emb:
                rec['embedding'] = emb
            self.supabase.table('roommate_profiles').upsert([rec]).execute()
            return {'success': True, 'id': rec.get('id')}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def upload_housing(self, listing: Dict[str, Any]) -> Dict[str, Any]:
        try:
            emb = self._embed(f"{listing.get('city','')} {listing.get('area','')} {listing.get('monthly_rent_pkr','')}")
            rec = { **listing }
            if emb:
                rec['embedding'] = emb
            self.supabase.table('housing_listings').upsert([rec]).execute()
            return {'success': True, 'id': rec.get('id')}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    # -------- User profile persistence --------
    def create_user_profile(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            profile = {
                'id': user_data['id'],
                'email': user_data.get('email'),
                'full_name': user_data.get('name', ''),
                'avatar_url': user_data.get('avatar_url', ''),
                'auth_provider': user_data.get('provider', 'email'),
                'created_at': time.strftime('%Y-%m-%d %H:%M:%S'),
                'updated_at': time.strftime('%Y-%m-%d %H:%M:%S')
            }
            self.supabase.table('user_profiles').upsert([profile]).execute()
            return {'success': True, 'profile': profile}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def get_current_user(self, access_token: str) -> Dict[str, Any]:
        try:
            self.supabase.auth.set_session(access_token, None)
            user = self.supabase.auth.get_user()
            if user.user:
                return {'success': True, 'user': {
                    'id': user.user.id,
                    'email': user.user.email,
                    'name': user.user.user_metadata.get('full_name', ''),
                    'avatar_url': user.user.user_metadata.get('avatar_url', '')
                }}
            return {'success': False, 'error': 'No authenticated user'}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    # -------- Simple search placeholders --------
    def semantic_search_profiles(self, query: str, limit: int=10, role_filter: str=None, city_filter: str=None):
        try:
            qb = self.supabase.table('roommate_profiles').select('*')
            if role_filter:
                qb = qb.eq('role', role_filter)
            if city_filter:
                qb = qb.ilike('city', f'%{city_filter}%')
            res = qb.limit(limit).execute()
            return [{'profile': r, 'similarity': 0.0} for r in res.data]
        except Exception:
            return []

    def semantic_search_housing(self, query: str, limit: int=10, city_filter: str=None, max_budget: int=None):
        try:
            qb = self.supabase.table('housing_listings').select('*')
            if city_filter:
                qb = qb.ilike('city', f'%{city_filter}%')
            if max_budget:
                qb = qb.lte('monthly_rent_pkr', max_budget)
            res = qb.limit(limit).execute()
            return [{'listing': r, 'similarity': 0.0} for r in res.data]
        except Exception:
            return []

    def get_database_stats(self):
        try:
            prof = self.supabase.table('roommate_profiles').select('id', count='exact').execute()
            housing = self.supabase.table('housing_listings').select('id', count='exact').execute()
            return {'roommate_count': getattr(prof, 'count', 0) or 0, 'housing_count': getattr(housing, 'count', 0) or 0}
        except Exception:
            return {'roommate_count': 0, 'housing_count': 0}


def setup_database():  # minimal now
    try:
        RoommateVectorDB()
        return True
    except Exception as e:
        logger.error(f'Setup failed: {e}')
        return False


if __name__ == '__main__':
    print('Setup OK' if setup_database() else 'Setup failed')
