---
aliases:
  - non-strict
  - weak
---
# Definition
A ___non-strict___ [[Order Relations|order]] on $X$ is a [[Transitivity of Relations|transitive]], [[Reflexivity of Relations|reflexive]] and [[Antisymmetry of Relations|antisymmetric]] [[Relations|relation]] on a [[Sets|set]] $X$.
# Aliases
- ___weak order___
# Implications
If an order $\preceq$ is non-strict, then sometimes you get "equality", where $x \preceq y$ and $y \preceq x$
that means that it is sometimes not clear whether an object comes before or after a different one.
# Examples
- $\leq$ is a non-strict order on $\mathbb{R}$ because for all $x, y, z \in \mathbb{R}$:
	- If $x \leq y$ and $y \leq z$ then $x \leq z$ (transitivity)
	- $x \leq x$ (reflexivity) 
	- If $x \leq y$ and $y \leq x$ then $x = y$ (antisymmetry)