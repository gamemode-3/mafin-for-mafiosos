!(((n ist quadratzahl) ^ (n ist gerade) -> n >= 17))

A := (n ist quadratzahl)
B := (n ist gerade)
C := (n >= 17)

!(   (A ^ B) -> C    )
!(   !(A ^ B) v C    )
!(  (!A v !B) v C    )
!(   !A v !B  v C    )
A ^ B  ^ !C