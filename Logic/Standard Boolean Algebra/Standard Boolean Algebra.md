---
aliases:
  - standard boolean algebra
---
# Definition
The ___standard boolean algebra___ is a special [[Boolean Algebra|boolean algebra]] where $V = \set{0, 1}, \otimes = \lor, \oplus = \land$.
# Huntington's Axioms
The [[Huntington's Axioms|huntington axioms]], when applied to the standard boolean algebra, look like as follows:

H1 Commutative Laws: &nbsp; $\begin{align}&a \lor b \leftrightarrow b \lor a \\ &a \land b \leftrightarrow b \land a\end{align}$

H2 Distributive Laws: &nbsp; $\begin{align}  a \land (b \lor c) \leftrightarrow (a \land b) \lor (a \land c) \\         a \lor (b \land c) \leftrightarrow (a \lor b) \land (a \lor c)  \end{align}$

H3 Neutral Elements: &nbsp; $\begin{align}  a \land 1 \leftrightarrow a \\ a \lor 0 \leftrightarrow a  \end{align}$

H4: Inverse Elements &nbsp; $\begin{align}  a \land \lnot a \leftrightarrow 0 \\    a \lor \lnot a \leftrightarrow 1  \end{align}$
# Further Basic Equivalences
The following equivalences can be derived from the huntington axioms:

R1: Associative Laws: &nbsp; $\begin{align} (a \land b) \land c \leftrightarrow a \land (b \land c) \\     (a \lor b) \lor c \leftrightarrow a \lor (b \lor c) \end{align}$

R2: Idempotent Laws: &nbsp; $\begin{align}  a \land a \leftrightarrow a \\ a \lor a \leftrightarrow a  \end{align}$

R3: Absorption Laws: &nbsp; $\begin{align}  a \land (a \lor b) \leftrightarrow a \\ a \lor (a \land b) \leftrightarrow a  \end{align}$

R4: De Morgan's Laws: &nbsp; $\begin{align}  \lnot (a \land b) \leftrightarrow \lnot a \lor \lnot b \\  \lnot (a \lor b) \leftrightarrow \lnot a \land \lnot b  \end{align}$

