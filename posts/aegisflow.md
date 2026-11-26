---
slug: aegisflow
title: "Why Adding Queue Length Made My Bayesian Cluster Scheduler Worse"
canonicalUrl: "https://theayush.pages.dev/projects/aegisflow"
repoUrl: "https://github.com/theayushagarwal/AegisFlow"
coverImage: "https://theayush.pages.dev/portfolio-preview.webp"
tags: [python, distributedsystems, machinelearning, algorithms]
fuelerTitle: "AegisFlow: Pure Python Exact Bayesian HMM Cluster Scheduler"
fuelerSkills: [Python, Bayesian Inference, Hidden Markov Models, Distributed Systems, Scheduling Algorithms, Fault Tolerance]
---

<!-- SECTION: ARTICLE -->
When I started writing AegisFlow, a zero-dependency Python scheduler for clusters with silent node failures, my first instinct was obvious: use queue depth (`queue_len`) as distress evidence alongside latency and error rate.

It made inference worse. When I actually inspected `env/cluster_env.py`, `queue_len` did not depend on node health or sensor noise at all. It was literally echoing my own scheduler's past dispatches back to me. Feeding a deterministic echo of my own decisions into a Bayesian filter created circular confirmation bias.

Dropping `queue_len` completely and pulling real signal out of telemetry was where the numbers clicked.

### Inferring node health without heuristics
Each node transitions latently between `Healthy`, `Degraded`, and `Down`. Instead of brittle z-score thresholds, `agent.py` runs an Exact 3-State Bayesian Hidden Markov Model forward filter over `heartbeat_ok`, `latency_ms`, `error_rate`, and per-task `duration_remaining` progress deltas. Across paired 400-step benchmarks, that reaches **99.58% hidden state accuracy**, catching degradation in **0.13 steps** and crashes in **0.35 steps** with **0.000% false condemnations**.

### Two math barriers that stopped cascading misses and thrashing
1. **Analytical Triage Gating**: Leaving a doomed task pending costs `-0.01/step`, whereas missing its deadline on a live node slot costs `-1.00`. Computing completion probability before dispatch keeps uncompletable jobs out of healthy slots, cutting deadline misses by **87%** (`98.2 -> 13.2`, raising on-time completion to **98.3%**). Removing triage alone swings ablation reward by `+714` points.
2. **Cold-Restart Expected-Value Barrier**: In stateful jobs, reassigning a running task resets `duration_remaining` back to `duration_total`. Caching `duration_total` on first sight and requiring target survival gain to strictly beat the lost-progress penalty dropped unnecessary migrations to **0.00** (zero churn), paired with a recovery probation ramp so recovering nodes do not get stampeded immediately.

Written in pure Python stdlib, `agent.py` runs at **0.64 ms/step** (39x under the 25.0 ms budget), passes **31/31** deterministic invariant checks (`test_invariants.py`), and reaches **96% of the theoretical Oracle ceiling** (`745.00 vs 750.94`).

Benchmark logs and ablation breakdown: https://theayush.pages.dev/projects/aegisflow

Source code: https://github.com/theayushagarwal/AegisFlow

<!-- SECTION: PEERLIST -->
Interesting lesson from writing a Bayesian cluster scheduler (AegisFlow): including `queue_len` in the node health filter actually hurt accuracy because `queue_len` only echoed my own past dispatches back with zero failure signal.

Swapping it for per-task progress deltas gave 99.58% node accuracy, -87% deadline misses, and 0.00 wasted migrations at 0.64 ms/step in pure Python stdlib.

https://theayush.pages.dev/projects/aegisflow

<!-- SECTION: FUELER -->
Pure Python stdlib cluster scheduler inferring latent Healthy/Degraded/Down states via an Exact 3-State Bayesian HMM over latency, heartbeat, error rate, and task progress deltas (99.58% state accuracy, 0.13-step degraded detection, 0.000% false condemnations). Pairs analytical triage gating (-87% deadline misses, 98.3% on-time) with a cold-restart expected-value barrier (0.00 unnecessary migrations), running at 0.64 ms/step with 31/31 invariant tests passing and 96% of Oracle ceiling score.

<!-- SECTION: X -->
Debugging AegisFlow (pure Python Bayesian HMM scheduler): I dropped `queue_len` from node inference because it only echoed my own dispatches back as distress signal.

99.58% state accuracy, -87% misses, 0.00 churn at 0.64 ms/step:
https://theayush.pages.dev/projects/aegisflow

<!-- SECTION: LINKEDIN -->
My first version of AegisFlow (a zero-dependency Python cluster scheduler) treated high `queue_len` as a sign that a node was failing. Checking the environment's true emission model showed why that backfired: `queue_len` didn't depend on node health at all, so feeding it into a Bayesian filter created a confirmation-bias loop from my own past dispatches.

Once I dropped `queue_len` and used per-task `duration_remaining` stalls alongside latency, heartbeats, and error rates, the 3-state Exact Bayesian HMM hit 99.58% state accuracy (detecting degradation in 0.13 steps with 0.000% false condemnations). Combining analytical triage gating with a cold-restart expected-value barrier cut deadline misses by 87% (`98.2 -> 13.2`), eliminated spurious migrations (`0.00`), and runs in 0.64 ms/step with 31/31 invariants passing.

Full breakdown: https://theayush.pages.dev/projects/aegisflow
GitHub: https://github.com/theayushagarwal/AegisFlow
