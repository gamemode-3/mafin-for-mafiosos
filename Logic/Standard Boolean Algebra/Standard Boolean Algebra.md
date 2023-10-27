---
aliases:
  - standard boolean algebra
---
# Definition
The ___standard boolean algebra___ is a special [[Boolean Algebra|boolean algebra]] where $V = \set{0, 1}, \otimes = \lor, \oplus = \land$.
# Huntington's Axioms
The [[Huntington's Axioms|huntington axioms]], when applied to the standard boolean algebra, look like as follows:

H1 Commutative Laws: &nbsp; $\begin{align}&a \lor b = b \lor a \\ &a \land b = b \land a\end{align}$

H2 Distributive Laws: &nbsp; $\begin{align}  a \land (b \lor c) = (a \land b) \lor (a \land c) \\         a \lor (b \land c) = (a \lor b) \land (a \lor c)  \end{align}$

H3 Neutral Elements: &nbsp; $\begin{align}  a \land 1 = a \\ a \lor 0 = a  \end{align}$

H4: Inverse Elements &nbsp; $\begin{align}  a \land \lnot a = 0 \\    a \lor \lnot a = 1  \end{align}$
# Further Basic Equivalences
The following equivalences can be derived from the huntington axioms:

R1: Associative Laws: &nbsp; $\begin{align} (a \land b) \land c = a \land (b \land c) \\     (a \lor b) \lor c = a \lor (b \lor c) \end{align}$

R2: Idempotent Laws: &nbsp; $\begin{align}  a \land a = a \\ a \lor a = a  \end{align}$

R3: Absorption Laws: &nbsp; $\begin{align}  a \land (a \lor b) = a \\ a \lor (a \land b) = a  \end{align}$

R4: De Morgan's Laws: &nbsp; $\begin{align}  \lnot (a \land b) = \lnot a \lor \lnot b \\  \lnot (a \lor b) = \lnot a \land \lnot b  \end{align}$

