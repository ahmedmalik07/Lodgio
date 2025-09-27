# 🗄️ Supabase Vector Database Setup Guide

This guide will help you set up a high-performance vector database for the Pakistani Roommate Matching System using Supabase.

## 🎯 **Overview**

We're upgrading from JSON-based matching to semantic vector search for:

- **Better matching accuracy** through AI embeddings
- **Faster search performance** with pgvector indexing
- **Scalable architecture** that can handle thousands of profiles
- **Semantic understanding** of Urdu/English mixed queries

## 📋 **Prerequisites**

✅ **Environment Variables Set**: `SUPABASE_URL` and `SUPABASE_ANON_KEY`  
✅ **Python Packages**: `sentence-transformers`, `supabase`  
✅ **Supabase Account**: Free tier includes pgvector extension

## 🚀 **Setup Steps**

### **Step 1: Create Tables in Supabase**

1. **Open Supabase Dashboard**: Go to https://supabase.com/dashboard
2. **Navigate to SQL Editor**: Click "SQL Editor" in the left sidebar
3. **Run Table Creation Script**:
   - Copy the entire contents of `create_supabase_tables.sql`
   - Paste into the SQL Editor
   - Click "Run" to execute

**What this does:**

- Enables pgvector extension for vector operations
- Creates `roommate_profiles` and `housing_listings` tables
- Adds vector columns with 384-dimensional embeddings
- Creates performance indexes for fast similarity search
- Sets up Row Level Security policies

### **Step 2: Upload Your Datasets**

Run the upload script to populate the database:

```powershell
# From your project root directory
python upload_to_supabase.py
```

**Expected Output:**

```
🏠 Roommate Matching System - Supabase Upload
==================================================
✅ Connected to Supabase successfully
📂 Found datasets:
   • Roommate profiles: datasets/new_synthetic_roommate_profiles_pakistan_400_with_roles.json
   • Housing listings: datasets/new_synthetic_housing_listings_pakistan_400.json

🔄 Uploading roommate profiles...
✅ Uploaded 400 roommate profiles successfully
   • Processing time: 45.23s

🔄 Uploading housing listings...
✅ Uploaded 400 housing listings successfully
   • Processing time: 32.17s

🎉 All datasets uploaded successfully!
🧪 Testing semantic search...
✅ Semantic search working! Found 3 matches for: 'quiet student looking for roommate in Islamabad'

📊 Database Summary:
   • Total roommate profiles: 400
   • Total housing listings: 400
   • Seekers: 102
   • Providers: 298

🚀 Your vector database is ready!
```

### **Step 3: Test the Integration**

Your agents will now automatically use semantic search! Test with:

```powershell
python agent_runner.py
```

Try queries like:

- "I'm a quiet engineering student in G-13 looking for clean roommate"
- "Need vegetarian roommate who studies late in DHA Lahore"
- "Medical student seeking peaceful accommodation near PIMS"

## 🔧 **How It Works**

### **Semantic Search Process:**

1. **Query Processing**: User input → AI embedding (384-dimensional vector)
2. **Vector Search**: Find similar profiles using cosine similarity
3. **Role Filtering**: Apply seeker/provider matching rules
4. **Results Ranking**: Return top matches with similarity scores

### **Fallback System:**

The system maintains full compatibility:

- **Vector DB Available**: Uses semantic search for better results
- **Vector DB Unavailable**: Falls back to JSON-based matching
- **No Code Changes**: Existing agents work unchanged

### **Performance Benefits:**

| Feature                 | JSON Method            | Vector Database         |
| ----------------------- | ---------------------- | ----------------------- |
| **Search Speed**        | O(n) linear scan       | O(log n) indexed search |
| **Query Understanding** | Exact keyword matching | Semantic similarity     |
| **Language Support**    | Limited Urdu support   | Mixed Urdu/English      |
| **Scalability**         | Degrades with size     | Scales to millions      |

## 🎛️ **Configuration Options**

### **Environment Variables:**

```bash
# Required
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Optional Performance Tuning
VECTOR_SEARCH_LIMIT=50        # Max results per search
EMBEDDING_BATCH_SIZE=10       # Batch size for uploads
SIMILARITY_THRESHOLD=0.7      # Minimum similarity score
```

### **Agent Integration:**

```python
# In your agents, use the enhanced search functions:
from utils.data_loader import sync_search_roommates, sync_search_housing

# Semantic roommate search
matches = sync_search_roommates(
    query="quiet medical student in Islamabad",
    user_role="seeker",
    user_city="Islamabad",
    max_results=10
)

# Semantic housing search
housing = sync_search_housing(
    query="2 bedroom apartment near university",
    city="Karachi",
    max_budget=50000,
    max_results=5
)
```

## 🔍 **Verification Commands**

### **Check Database Status:**

```sql
-- Run in Supabase SQL Editor
SELECT 'roommate_profiles' as table, COUNT(*) as count FROM roommate_profiles
UNION ALL
SELECT 'housing_listings' as table, COUNT(*) as count FROM housing_listings;
```

### **Test Semantic Search:**

```sql
-- Find similar profiles to a query
SELECT id, role, city, area,
       embedding <=> '[0.1,0.2,...]'::vector as similarity
FROM roommate_profiles
ORDER BY similarity
LIMIT 5;
```

### **Monitor Performance:**

```sql
-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE tablename IN ('roommate_profiles', 'housing_listings');
```

## ⚡ **Performance Tips**

1. **Batch Operations**: Upload large datasets in batches of 10-50 records
2. **Index Maintenance**: Rebuild indexes monthly for optimal performance
3. **Query Optimization**: Use city/role filters before vector search
4. **Connection Pooling**: Reuse database connections in production

## 🆘 **Troubleshooting**

### **Common Issues:**

**❌ "Could not connect to Supabase"**

- Check your environment variables
- Verify internet connection
- Ensure project is not paused

**❌ "Vector extension not found"**

- Run the SQL setup script completely
- Check if pgvector is enabled in your project

**❌ "Slow search performance"**

- Ensure indexes are created (`CREATE INDEX` statements)
- Check if you have too many dimensions (should be 384)
- Consider increasing `lists` parameter in index

**❌ "No search results"**

- Check if data was uploaded successfully
- Verify role filtering logic
- Try broader search queries

### **Getting Help:**

1. **Check Logs**: Look at Supabase logs in dashboard
2. **Test Locally**: Use `upload_to_supabase.py` for diagnostics
3. **SQL Debugging**: Run test queries in Supabase SQL Editor
4. **Fallback Mode**: System works with JSON if vector DB fails

## 🎉 **Success Indicators**

✅ Tables created successfully  
✅ All 800 records uploaded (400 profiles + 400 listings)  
✅ Semantic search returns relevant results  
✅ Role-based filtering working  
✅ Performance improvement over JSON search  
✅ Agents integrate seamlessly

Your Pakistani roommate matching system is now powered by cutting-edge AI vector search! 🚀
