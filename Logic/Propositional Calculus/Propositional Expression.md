# Definition
Let $X$ be a [[Set|set]] of [[Proposition|proposition]] variables. A ___logical expression___ in [[Standard Boolean Algebra|standard boolean algebra]] is a [[Character String|character string]] in $\mathcal{F}$ where $\mathcal{F}$ is the smallest set that
- Contains all strings from $X$ 
- For any $P, Q \in \mathcal{F}$, contains:
	- $\lnot P$
	- $(P \lor Q)$
	- $(P \land Q)$
	- $(P \rightarrow Q)$
	- $(P \leftrightarrow Q)$
By this definition, $P \land Q$ and $P \lor \lnot Q \lor P \land Q$ are not expressions because they are missing the parentheses. I will however be omitting the outermost parentheses.