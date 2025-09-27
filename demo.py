#!/usr/bin/env python3
"""
Sample demonstration of the Roommate Matching System
Run this to see example matches and system capabilities.
"""

from rich.console import Console
from rich.table import Table
from rich.panel import Panel

from utils.data_loader import load_roommate_profiles


def display_sample_profiles():
    """Display some sample profiles from the dataset."""
    console = Console()
    profiles = load_roommate_profiles()
    
    console.print("\n[bold blue]📋 Sample Roommate Profiles from Dataset[/bold blue]\n")
    
    # Show first 5 profiles as examples
    table = Table(show_header=True, header_style="bold magenta")
    table.add_column("ID", style="cyan", width=8)
    table.add_column("City", style="green", width=12)
    table.add_column("Budget (PKR)", style="yellow", width=12)
    table.add_column("Raw Profile Text", style="white", width=50)
    
    for profile in profiles[:5]:
        table.add_row(
            profile['id'],
            profile['city'],
            str(profile['budget_PKR']),
            profile['raw_profile_text'][:50] + "..." if len(profile['raw_profile_text']) > 50 else profile['raw_profile_text']
        )
    
    console.print(table)


def display_sample_queries():
    """Display sample queries users can try."""
    console = Console()
    
    sample_queries = [
        "Find me a roommate in Karachi with budget around 15k who is tidy",
        "Match profile R-001 with compatible roommates and suggest housing",
        "Compare profiles R-003 and R-010 for compatibility",
        "I need a quiet roommate in Islamabad for online classes, budget 20k max",
        "Find housing options in Lahore for two students with 25k combined budget"
    ]
    
    console.print("\n[bold green]💡 Sample Queries You Can Try:[/bold green]\n")
    
    for i, query in enumerate(sample_queries, 1):
        panel = Panel(
            query,
            title=f"Example {i}",
            border_style="blue",
            padding=(0, 1)
        )
        console.print(panel)


def display_system_overview():
    """Display overview of the roommate matching system."""
    console = Console()
    
    overview = """
🏠 [bold blue]Roommate Matching System for Pakistani Students[/bold blue]

This AI-powered system helps students find compatible roommates and housing using:

[bold cyan]🔍 Profile Reader Agent[/bold cyan]
• Parses messy Urdu/English roommate ads
• Extracts structured data (budget, habits, preferences)

[bold cyan]📊 Match Scorer Agent[/bold cyan] 
• Calculates compatibility scores (0-100)
• Considers sleep, cleanliness, noise, study habits, budget

[bold cyan]🚩 Red Flag Agent[/bold cyan]
• Detects serious lifestyle conflicts
• Identifies safety and cultural mismatches

[bold cyan]🤝 Wingman Agent[/bold cyan]
• Provides clear explanations for matches
• Suggests practical compromises

[bold cyan]🏡 Room Hunter Agent[/bold cyan]
• Finds suitable housing from 400+ listings
• Matches location, budget, and amenities

[bold yellow]Datasets:[/bold yellow] 400 synthetic roommate profiles + 400 housing listings
[bold yellow]Languages:[/bold yellow] Handles mixed Urdu/English text naturally
[bold yellow]Culture:[/bold yellow] Considers Pakistani student lifestyle and norms
    """
    
    console.print(Panel(overview, title="System Overview", border_style="green", padding=1))


def main():
    """Main demonstration function."""
    console = Console()
    
    console.print("[bold red]🎯 Roommate Matching System Demo[/bold red]\n")
    
    display_system_overview()
    display_sample_profiles()
    display_sample_queries()
    
    console.print("\n[bold green]🚀 Ready to start![/bold green]")
    console.print("Run 'python agent_runner.py' to begin interactive matching session.\n")


if __name__ == "__main__":
    main()
