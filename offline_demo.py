#!/usr/bin/env python3
"""
Offline demonstration of the roommate matching logic
Shows how the system would process sample profiles without requiring API calls
"""

from rich.console import Console
from rich.table import Table

from utils.data_loader import load_roommate_profiles, load_housing_listings


def calculate_simple_compatibility(profile1, profile2):
    """Simple compatibility calculator for demo purposes"""
    score = 0
    factors = {}
    
    # Sleep schedule compatibility (25 points)
    if profile1.get('sleep_schedule') == profile2.get('sleep_schedule'):
        sleep_score = 25
    elif 'Flexible' in [profile1.get('sleep_schedule'), profile2.get('sleep_schedule')]:
        sleep_score = 20
    else:
        sleep_score = 5
    factors['sleep'] = sleep_score
    score += sleep_score
    
    # Cleanliness compatibility (25 points)
    clean_levels = {'Tidy': 3, 'Average': 2, 'Messy': 1}
    c1 = clean_levels.get(profile1.get('cleanliness', 'Average'), 2)
    c2 = clean_levels.get(profile2.get('cleanliness', 'Average'), 2)
    clean_diff = abs(c1 - c2)
    if clean_diff == 0:
        clean_score = 25
    elif clean_diff == 1:
        clean_score = 15
    else:
        clean_score = 5
    factors['cleanliness'] = clean_score
    score += clean_score
    
    # Budget alignment (25 points)
    budget_diff = abs(profile1.get('budget_PKR', 0) - profile2.get('budget_PKR', 0))
    if budget_diff <= 5000:
        budget_score = 25
    elif budget_diff <= 10000:
        budget_score = 15
    elif budget_diff <= 15000:
        budget_score = 10
    else:
        budget_score = 3
    factors['budget'] = budget_score
    score += budget_score
    
    # Location bonus (10 points)
    if profile1.get('city') == profile2.get('city'):
        location_score = 10
        if profile1.get('area') == profile2.get('area'):
            location_score = 15
    else:
        location_score = 0
    factors['location'] = location_score
    score += location_score
    
    # Study habits (15 points)
    study1 = profile1.get('study_habits', '')
    study2 = profile2.get('study_habits', '')
    if study1 == study2:
        study_score = 12
    elif ('Online' in study1 and 'Library' in study2) or ('Library' in study1 and 'Online' in study2):
        study_score = 15  # Complementary
    else:
        study_score = 8
    factors['study'] = study_score
    score += study_score
    
    return score, factors


def detect_simple_red_flags(profile1, profile2):
    """Simple red flag detection for demo"""
    red_flags = []
    
    # Sleep schedule conflicts
    if (profile1.get('sleep_schedule') == 'Night owl' and profile2.get('sleep_schedule') == 'Early riser') or \
       (profile1.get('sleep_schedule') == 'Early riser' and profile2.get('sleep_schedule') == 'Night owl'):
        red_flags.append("⚠️ Major sleep schedule conflict")
    
    # Cleanliness extremes
    if (profile1.get('cleanliness') == 'Tidy' and profile2.get('cleanliness') == 'Messy') or \
       (profile1.get('cleanliness') == 'Messy' and profile2.get('cleanliness') == 'Tidy'):
        red_flags.append("🧽 Extreme cleanliness mismatch")
    
    # Budget mismatch
    budget_diff = abs(profile1.get('budget_PKR', 0) - profile2.get('budget_PKR', 0))
    if budget_diff > 15000:
        red_flags.append("💰 Major budget mismatch")
    
    return red_flags


def find_housing_matches(profile1, profile2, max_results=3):
    """Find housing that matches both profiles"""
    city = profile1.get('city')
    if city != profile2.get('city'):
        return []
    
    combined_budget = (profile1.get('budget_PKR', 0) + profile2.get('budget_PKR', 0)) * 1.1
    
    listings = load_housing_listings()
    matches = []
    
    for listing in listings:
        if (listing.get('city') == city and 
            listing.get('availability') == 'Available' and
            listing.get('monthly_rent_PKR', 0) <= combined_budget and
            listing.get('rooms_available', 0) >= 1):
            matches.append(listing)
    
    return matches[:max_results]


def demo_matching():
    """Demonstrate the matching system with sample profiles"""
    console = Console()
    
    console.print("\n[bold blue]🎯 Roommate Matching Demo - Offline Analysis[/bold blue]\n")
    
    profiles = load_roommate_profiles()
    
    # Show a few sample matches
    sample_pairs = [
        (profiles[0], profiles[3]),  # Both in Islamabad
        (profiles[1], profiles[8]),  # Both in Karachi  
        (profiles[2], profiles[5])  # Different cities
    ]
    
    for i, (p1, p2) in enumerate(sample_pairs, 1):
        console.print(f"\n[bold yellow]📋 Match Analysis #{i}[/bold yellow]")
        
        # Show profiles
        table = Table(show_header=True, header_style="bold magenta")
        table.add_column("Aspect", style="cyan")
        table.add_column(f"{p1['id']}", style="green")
        table.add_column(f"{p2['id']}", style="blue")
        
        table.add_row("City", p1['city'], p2['city'])
        table.add_row("Area", p1.get('area', 'N/A'), p2.get('area', 'N/A'))
        table.add_row("Budget", f"{p1['budget_PKR']:,} PKR", f"{p2['budget_PKR']:,} PKR")
        table.add_row("Sleep Schedule", p1['sleep_schedule'], p2['sleep_schedule'])
        table.add_row("Cleanliness", p1['cleanliness'], p2['cleanliness'])
        table.add_row("Study Habits", p1['study_habits'], p2['study_habits'])
        
        console.print(table)
        
        # Calculate compatibility
        score, factors = calculate_simple_compatibility(p1, p2)
        red_flags = detect_simple_red_flags(p1, p2)
        
        # Show results
        if score >= 80:
            match_level = "[bold green]Excellent Match[/bold green] 🎉"
        elif score >= 60:
            match_level = "[bold yellow]Good Match[/bold yellow] 👍"
        elif score >= 40:
            match_level = "[bold orange3]Fair Match[/bold orange3] 🤔"
        else:
            match_level = "[bold red]Poor Match[/bold red] ❌"
        
        console.print(f"\n[bold]Compatibility Score:[/bold] {score}/100 ({match_level})")
        
        # Show factor breakdown
        factor_text = " | ".join([f"{k}: {v}" for k, v in factors.items()])
        console.print(f"[dim]Breakdown: {factor_text}[/dim]")
        
        # Show red flags
        if red_flags:
            console.print(f"[bold red]Red Flags:[/bold red]")
            for flag in red_flags:
                console.print(f"  {flag}")
        else:
            console.print("[green]✅ No major red flags detected[/green]")
        
        # Find housing if compatible and same city
        if score >= 60 and p1['city'] == p2['city']:
            housing_matches = find_housing_matches(p1, p2)
            if housing_matches:
                console.print(f"\n[bold cyan]🏡 Available Housing Options in {p1['city']}:[/bold cyan]")
                for j, house in enumerate(housing_matches[:2], 1):
                    rent_per_person = house['monthly_rent_PKR'] // 2
                    console.print(f"  {j}. {house['listing_id']} - {house['area']} ({rent_per_person:,} PKR/person)")
        
        console.print("\n" + "─" * 60)


if __name__ == "__main__":
    demo_matching()
