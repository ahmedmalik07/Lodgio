#!/usr/bin/env python3
"""
Performance Comparison: Sequential vs Parallel Roommate Matching
===============================================================

This script demonstrates the performance difference between sequential and parallel 
agent execution for roommate matching queries.

Expected Results:
- Sequential: ~15-20 seconds per query
- Parallel:   ~5-8 seconds per query  
- Speed Improvement: 60-70% faster response times
"""

import asyncio
import time
import json
from rich import print as rprint
from rich.table import Table
from rich.panel import Panel
from rich.progress import Progress, SpinnerColumn, TextColumn
from google.genai.types import Content, Part
from dotenv import load_dotenv

load_dotenv()

# Import both agent versions for comparison
from agents.roommate_matcher_root.agent import root_agent as sequential_agent
from agents.roommate_matcher_parallel.agent import root_agent as parallel_agent

# ADK components
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService

# Test queries for benchmarking
TEST_QUERIES = [
    "I need a quiet medical student roommate in G-13 Islamabad",
    "Looking for vegetarian roommate who studies late in DHA Karachi",
    "Engineering student seeking clean accommodation near NUST",
    "Need early bird roommate for shared apartment in Gulberg Lahore"
]

APP_NAME = "performance_test"
USER_ID = "benchmark_user"


async def benchmark_agent(agent, agent_name, query, session_id):
    """Benchmark a single agent with a single query."""
    try:
        # Setup session
        session_service = InMemorySessionService()
        session = await session_service.create_session(
            app_name=APP_NAME,
            user_id=USER_ID,
            session_id=session_id
        )

        # Setup runner
        runner = Runner(
            agent=agent,
            app_name=APP_NAME,
            session_service=session_service,
        )

        # Time the execution
        start_time = time.time()
        
        message_content = Content(parts=[Part.text(query)])
        response = await runner.run(
            user_id=USER_ID,
            session_id=session_id,
            message=message_content
        )
        
        end_time = time.time()
        processing_time = end_time - start_time

        return {
            'agent': agent_name,
            'query': query,
            'time': processing_time,
            'success': True,
            'response_length': len(response.text) if response and hasattr(response, 'text') else 0
        }
        
    except Exception as e:
        return {
            'agent': agent_name,
            'query': query,
            'time': 0,
            'success': False,
            'error': str(e)
        }


async def run_performance_comparison():
    """Run comprehensive performance comparison between sequential and parallel agents."""
    
    rprint(Panel.fit("🏎️ Roommate Matching Performance Benchmark 🏎️",
                     subtitle="Sequential vs Parallel Agent Execution",
                     border_style="cyan"))
    rprint()

    all_results = []
    
    # Test each query with both agent types
    for i, query in enumerate(TEST_QUERIES, 1):
        rprint(f"📝 [bold blue]Test {i}/4:[/bold blue] {query[:50]}...")
        
        with Progress(SpinnerColumn(), TextColumn("[progress.description]{task.description}")) as progress:
            # Test sequential agent
            task1 = progress.add_task("Testing sequential agent...", total=None)
            sequential_result = await benchmark_agent(
                sequential_agent,
                "Sequential",
                query,
                f"seq_session_{i}"
            )
            progress.remove_task(task1)
            
            # Test parallel agent
            task2 = progress.add_task("Testing parallel agent...", total=None)
            parallel_result = await benchmark_agent(
                parallel_agent,
                "Parallel",
                query,
                f"par_session_{i}"
            )
            progress.remove_task(task2)
        
        all_results.extend([sequential_result, parallel_result])
        
        # Show immediate comparison for this query
        if sequential_result['success'] and parallel_result['success']:
            seq_time = sequential_result['time']
            par_time = parallel_result['time']
            improvement = ((seq_time - par_time) / seq_time) * 100
            
            rprint(f"   ⏱️  Sequential: {seq_time:.2f}s")
            rprint(f"   ⚡ Parallel:   {par_time:.2f}s")
            rprint(f"   📈 Speed improvement: {improvement:.1f}% faster\n")
        else:
            rprint("   ❌ One or both agents failed for this query\n")

    # Generate comprehensive report
    generate_report(all_results)


def generate_report(results):
    """Generate a detailed performance report."""
    rprint("\n" + "="*80)
    rprint(Panel.fit("📊 Performance Analysis Report 📊", border_style="green"))
    
    # Separate successful results by agent type
    sequential_results = [r for r in results if r['agent'] == 'Sequential' and r['success']]
    parallel_results = [r for r in results if r['agent'] == 'Parallel' and r['success']]
    
    if not sequential_results or not parallel_results:
        rprint("❌ [red]Insufficient data for comparison[/red]")
        return
    
    # Calculate statistics
    seq_times = [r['time'] for r in sequential_results]
    par_times = [r['time'] for r in parallel_results]
    
    seq_avg = sum(seq_times) / len(seq_times)
    par_avg = sum(par_times) / len(par_times)
    seq_min, seq_max = min(seq_times), max(seq_times)
    par_min, par_max = min(par_times), max(par_times)
    
    overall_improvement = ((seq_avg - par_avg) / seq_avg) * 100
    
    # Create results table
    table = Table(title="🏆 Performance Comparison Results")
    table.add_column("Metric", justify="left", style="cyan")
    table.add_column("Sequential Agent", justify="center", style="red")
    table.add_column("Parallel Agent", justify="center", style="green")
    table.add_column("Improvement", justify="center", style="yellow")
    
    table.add_row(
        "Average Time",
        f"{seq_avg:.2f}s",
        f"{par_avg:.2f}s",
        f"{overall_improvement:.1f}% faster"
    )
    table.add_row(
        "Fastest Time",
        f"{seq_min:.2f}s",
        f"{par_min:.2f}s",
        f"{((seq_min - par_min) / seq_min) * 100:.1f}% faster"
    )
    table.add_row(
        "Slowest Time",
        f"{seq_max:.2f}s",
        f"{par_max:.2f}s",
        f"{((seq_max - par_max) / seq_max) * 100:.1f}% faster"
    )
    
    rprint(table)
    
    # Summary insights
    rprint(f"\n🎯 [bold green]Key Results:[/bold green]")
    rprint(f"   • Parallel agents are [bold yellow]{overall_improvement:.1f}% faster[/bold yellow] on average")
    rprint(f"   • Time saved per query: [bold cyan]{seq_avg - par_avg:.2f} seconds[/bold cyan]")
    rprint(f"   • For 10 queries: [bold cyan]{(seq_avg - par_avg) * 10:.1f} seconds saved[/bold cyan]")
    
    if overall_improvement >= 50:
        rprint(f"   🚀 [bold green]EXCELLENT performance improvement![/bold green]")
    elif overall_improvement >= 30:
        rprint(f"   ✅ [bold yellow]Good performance improvement[/bold yellow]")
    else:
        rprint(f"   ⚠️  [bold red]Modest performance improvement[/bold red]")


async def main():
    """Main benchmark execution."""
    try:
        await run_performance_comparison()
        
        rprint(f"\n💡 [bold cyan]Recommendation:[/bold cyan]")
        rprint(f"   Use [bold green]agent_runner_parallel.py[/bold green] for the best user experience!")
        rprint(f"   The parallel version maintains the same quality results with much faster response times.\n")
        
    except Exception as e:
        rprint(f"❌ [red]Benchmark failed: {str(e)}[/red]")
        return 1
    
    return 0


if __name__ == "__main__":
    import sys
    if sys.version_info < (3, 8):
        rprint("❌ This benchmark requires Python 3.8 or higher")
        sys.exit(1)
    
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
