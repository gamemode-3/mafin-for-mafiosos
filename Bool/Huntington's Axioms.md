---
aliases:
  - huntington axioms
  - huntington's axioms
---
# Definition
___Huntington's Axioms___ are the minimal axioms for [[Boolean Algebra|boolean algebra]]. They are as follows for a [[Sets|set]] $V = \set{a, b, c}$ with $\oplus$ and $\otimes$ such that
$$\begin{align}
a \otimes b \in V \\
a \oplus b \in V
\end{align}$$
## H1: Commutative Law
$$\begin{align}
a \otimes b = b \otimes a \\
a \oplus b = b \oplus a
\end{align}$$

## H2: Distributive Law
$$\begin{align}
a \otimes (b \oplus c) = (a \otimes b) \oplus (a \otimes c) \\
a \oplus (b \otimes c) = (a \oplus b) \otimes (a \oplus c)
\end{align}$$
## H3: Neutral Elements
There exist two elements $e, n \in V$ such that:
$$\begin{align}
	a \otimes e = a \\
	a \oplus n = a	
\end{align}$$
We call $e$ the 