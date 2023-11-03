$g(n) : (x + y)^{n} = \sum^{n}_{k = 0} \binom{n}{k} x^{n-k} y^{k}$ 

for $n = 0$ (if you accept $0^{0}=1$, otherwise is true as long as $x+y \neq 0 \land x \neq 0 \land y \neq 0$)
$(x+y)^{0} = 1$
$\sum^{0}_{k = 0} \binom{0}{k} x^{0-k} y^{k} = \binom{0}{0} x^{0-0} y^{0} = 1$ 

now it must be proven that $(g(n) \to g(n + 1))$ 

$$(x + y)^{n + 1} = \sum^{n + 1}_{k = 0} \binom{n + 1}{k} x^{n+1-k} y^{k}$$
Let us first examine how to transform $\binom{n + 1}{k}$ to something containing $\binom{n}{k}$
$$\binom{n+1}{k} = \frac{(n + 1)!}{k!(n - k + 1)!} = \frac{n! \cdot (n + 1)}{k!(n - k)! \cdot (n - k + 1)} = \frac{#}{#}$$

$$(x + y)^{n} \cdot (x + y) = \sum^{n}_{k = 0} \frac{(n + 1)!}{k!(n - 1 + k)!} x \cdot x^{n-k} y^{k} + \binom{n + 1}{n + 1} \cdot x^{0} \cdot y^{n + 1}$$ 