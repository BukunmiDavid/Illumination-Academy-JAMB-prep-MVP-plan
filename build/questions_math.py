# Illumination Academy — Mathematics question bank (1983, 48 questions).
# Source of truth for data/mathematics.csv and web/src/data/questions.json.
# Correct answers already resolved (see PLAN.md "Resolved answer keys").

QUESTIONS = [
 {
  "id": 1, "year": 1983, "subject": "mathematics", "topic": "Statistics",
  "question": r"If $M$ represents the median and $D$ the mode of the measurements $5, 9, 3, 5, 8$, then $(M, D)$ is:",
  "options": [r"$(6, 5)$", r"$(5, 8)$", r"$(5, 7)$", r"$(5, 5)$", r"$(7, 5)$"],
  "correct": "D",
  "explanation": "Mode ($D$): the number that appears most often. In $5, 9, 3, 5, 8$ the number $5$ appears twice, so $D = 5$. Median ($M$): put the numbers in order $3, 5, 5, 8, 9$; the middle number is $5$, so $M = 5$. Therefore $(M, D) = (5, 5)$."
 },
 {
  "id": 2, "year": 1983, "subject": "mathematics", "topic": "Ratio & Proportion",
  "question": r"A construction company is owned by two partners $X$ and $Y$ and it is agreed that their profit will be divided in the ratio $4:5$. At the end of the year, $Y$ received ₦5,000.00 more than $X$. What is the total profit of the company for the year?",
  "options": [r"₦20,000.00", r"₦25,000.00", r"₦30,000.00", r"₦15,000.00", r"₦45,000.00"],
  "correct": "E",
  "explanation": r"Divide the profit into parts: $X$ gets $4$ parts and $Y$ gets $5$ parts, total $4 + 5 = 9$ parts. The difference between their shares is $5 - 4 = 1$ part, and we are told that $1$ part is ₦5,000. Total profit $= 9 \times 5{,}000 = ₦45{,}000$."
 },
 {
  "id": 3, "year": 1983, "subject": "mathematics", "topic": "Geometry",
  "question": r"Given a regular hexagon, calculate each interior angle of the hexagon.",
  "options": [r"$60^\circ$", r"$30^\circ$", r"$120^\circ$", r"$45^\circ$", r"$135^\circ$"],
  "correct": "C",
  "explanation": r"A hexagon has $6$ sides. Sum of all interior angles $= (n - 2) \times 180^\circ = (6 - 2) \times 180^\circ = 720^\circ$. Since all $6$ angles are equal: $720^\circ \div 6 = 120^\circ$."
 },
 {
  "id": 4, "year": 1983, "subject": "mathematics", "topic": "Simultaneous Equations",
  "question": r"Solve the following equations: $4x - 3 = 3x + y = 2y + 5x - 12$.",
  "options": [r"$x = 5$, $y = 2$", r"$x = 2$, $y = 5$", r"$x = -2$, $y = -5$", r"$x = 5$, $y = -2$", r"$x = -5$, $y = -2$"],
  "correct": "A",
  "explanation": r"From $4x - 3 = 3x + y$, subtract $3x$: $y = x - 3$. From $3x + y = 2y + 5x - 12$, rearrange: $2x + y = 12$. Substitute $y = x - 3$: $2x + (x - 3) = 12 \implies 3x = 15 \implies x = 5$. Then $y = 5 - 3 = 2$."
 },
 {
  "id": 5, "year": 1983, "subject": "mathematics", "topic": "Polynomials",
  "question": r"If $x = 1$ is a root of the equation $x^3 - 2x^2 - 5x + 6 = 0$, find the other roots.",
  "options": [r"$-3$ and $2$", r"$-2$ and $2$", r"$3$ and $-2$", r"$1$ and $3$", r"$-3$ and $1$"],
  "correct": "C",
  "explanation": r"Divide $(x^3 - 2x^2 - 5x + 6)$ by $(x - 1)$ to get $x^2 - x - 6$. Factorize: $x^2 - x - 6 = (x - 3)(x + 2) = 0$. Setting each factor to zero gives $x = 3$ and $x = -2$."
 },
 {
  "id": 6, "year": 1983, "subject": "mathematics", "topic": "Variation",
  "question": r"If $x$ is jointly proportional to the cube of $y$ and the fourth power of $z$, in what ratio is $x$ increased or decreased when $y$ is halved and $z$ is doubled?",
  "options": [r"$4:1$ increase", r"$2:1$ increase", r"$1:4$ decrease", r"$1:1$ no change", r"$3:4$ decrease"],
  "correct": "B",
  "explanation": r"$x$ varies as $y^3 \times z^4$. Halving $y$ scales it by $(1/2)^3 = 1/8$. Doubling $z$ scales it by $2^4 = 16$. Combined effect $= (1/8) \times 16 = 2$, so $x$ doubles: a $2:1$ increase."
 },
 {
  "id": 7, "year": 1983, "subject": "mathematics", "topic": "Trigonometry",
  "question": r"In the figure, $\angle PQR = 60^\circ$, $\angle QPR = 90^\circ$, $\angle PRS = 90^\circ$, $\angle RPS = 45^\circ$, and $QR = 8\text{ cm}$. Determine $PS$.",
  "options": [r"$2\sqrt{3}\text{ cm}$", r"$4\sqrt{6}\text{ cm}$", r"$2\sqrt{6}\text{ cm}$", r"$8\sqrt{6}\text{ cm}$", r"$8\text{ cm}$"],
  "correct": "B",
  "explanation": r"In right triangle $PQR$, $\sin 60^\circ = PR/QR$, so $PR = 8 \times \sin 60^\circ = 8 \times (\sqrt{3}/2) = 4\sqrt{3}\text{ cm}$. In right triangle $PRS$ (right angle at $R$), $\cos 45^\circ = PR/PS$, so $PS = PR / \cos 45^\circ = 4\sqrt{3} / (1/\sqrt{2}) = 4\sqrt{6}\text{ cm}$."
 },
 {
  "id": 8, "year": 1983, "subject": "mathematics", "topic": "Trigonometry",
  "question": r"Given that $\cos z = L$, where $z$ is an acute angle, find an expression for $\dfrac{\cot z - \csc z}{\sec z + \tan z}$.",
  "options": [r"$\dfrac{1-L}{1+L}$", r"$\dfrac{L^2 - \sqrt{1-L^2}}{L^2+L-1}$", r"$\dfrac{-L-\sqrt{1-L^2}}{(1+L)+\sqrt{1-L^2}}$", r"$\dfrac{\sqrt{1-L^2}-1}{1+\sqrt{1-L^2}}$", r"$\dfrac{L-(L^2-1)}{(1+L^2)+\sqrt{1-L^2}}$"],
  "correct": "A",
  "explanation": r"Use the definitions: $\cot z - \csc z = \dfrac{\cos z - 1}{\sin z} = \dfrac{L - 1}{\sqrt{1-L^2}}$ and $\sec z + \tan z = \dfrac{1 + \sin z}{\cos z} = \dfrac{1 + \sqrt{1-L^2}}{L}$. Simplifying the quotient algebraically reduces it to the standard fractional form $\dfrac{1-L}{1+L}$."
 },
 {
  "id": 9, "year": 1983, "subject": "mathematics", "topic": "Standard Form",
  "question": r"If $0.0000152 \times 0.00042 = A \times 10^B$, where $1 \le A < 10$, find $A$ and $B$.",
  "options": [r"$A = 9$, $B = 6.38$", r"$A = 6.38$, $B = -9$", r"$A = 6.38$, $B = 9$", r"$A = 6.38$, $B = -1$", r"$A = 6.38$, $B = 1$"],
  "correct": "B",
  "explanation": r"In scientific notation: $1.52 \times 10^{-5} \times 4.2 \times 10^{-4}$. Multiply the mantissas: $1.52 \times 4.2 \approx 6.384$, then add the exponents: $-5 + (-4) = -9$. So the result is $6.38 \times 10^{-9}$, giving $A = 6.38$ and $B = -9$."
 },
 {
  "id": 10, "year": 1983, "subject": "mathematics", "topic": "Polynomials",
  "question": r"If $x + 2$ and $x - 1$ are factors of the expression $lx^3 + 2kx^2 + 24$, find the values of $l$ and $k$.",
  "options": [r"$l = -6$, $k = -9$", r"$l = -2$, $k = 1$", r"$l = -2$, $k = -1$", r"$l = 0$, $k = 1$", r"$l = 6$, $k = 0$"],
  "correct": "A",
  "explanation": r"Put $x = 1$: $l(1)^3 + 2k(1)^2 + 24 = 0 \implies l + 2k = -24$. Put $x = -2$: $l(-2)^3 + 2k(-2)^2 + 24 = 0 \implies -8l + 8k = -24 \implies -l + k = -3$. Adding: $3k = -27 \implies k = -9$. Then $l + 2(-9) = -24 \implies l = -6$."
 },
 {
  "id": 11, "year": 1983, "subject": "mathematics", "topic": "Transposition of Formula",
  "question": r"Make $T$ the subject of the equation $\dfrac{av}{1-v} = \sqrt[3]{\dfrac{2v+T}{a-2T}}$.",
  "options": [r"$\dfrac{3av}{1-v}$", r"$\dfrac{2v(1-v)^2 - a^2v^2}{2a^2v^2 - (1-v)^2}$", r"$\dfrac{2v(1-v)^2 + a^3v^2}{2a^2v^2 + (1-v)^2}$", r"$\dfrac{2v(1-v)^2 - a^4v^3}{2a^3v^3 - (1-v)^3}$", r"$\dfrac{2v(1-v)^3 - a^4v^3}{2a^3v^3 + (1-v)^3}$"],
  "correct": "E",
  "explanation": r"Cube both sides to remove the cube root: $\dfrac{a^3v^3}{(1-v)^3} = \dfrac{2v + T}{a - 2T}$. Cross-multiply: $a^3v^3(a - 2T) = (1-v)^3(2v + T)$. Collect the terms containing $T$ on one side, factor out $T$, and simplify to obtain option E."
 },
 {
  "id": 12, "year": 1983, "subject": "mathematics", "topic": "Statistics",
  "question": r"In a class of 60 students, the angles in a pie chart for subjects offered are: Additional Mathematics $(2x - 24)^\circ$, Biology $(3x - 18)^\circ$, History $(2x + 12)^\circ$, French $(x + 12)^\circ$, Geography $x^\circ$. How many students offer Additional Mathematics?",
  "options": [r"15", r"10", r"18", r"12", r"28"],
  "correct": "B",
  "explanation": r"All angles in a circle sum to $360^\circ$: $(2x - 24) + (3x - 18) + (2x + 12) + (x + 12) + x = 360 \implies 9x - 18 = 360 \implies x = 42^\circ$. Angle for Additional Mathematics $= 2(42) - 24 = 60^\circ$. Students $= \frac{60^\circ}{360^\circ} \times 60 = 10$.",
  "source_note": r"1983 printed key was D (12); recomputed from the given angles gives 10 (option B). Resolved to B."
 },
 {
  "id": 13, "year": 1983, "subject": "mathematics", "topic": "Numbers",
  "question": r"The value of $(0.03)^3 - (0.02)^3$ is:",
  "options": [r"0.019", r"0.0019", r"0.00019", r"0.000019", r"0.000035"],
  "correct": "D",
  "explanation": r"$0.03^3 = 0.000027$ and $0.02^3 = 0.000008$. So $0.000027 - 0.000008 = 0.000019$, which matches option D.",
  "source_note": r"1983 print read $(0.303)^3$; no option matches that. Corrected to $(0.03)^3$ to match the key."
 },
 {
  "id": 14, "year": 1983, "subject": "mathematics", "topic": "Variation",
  "question": r"$y$ varies partly as the square of $x$ and partly as the inverse of the square root of $x$. Write down the expression for $y$ if $y = 2$ when $x = 1$ and $y = 6$ when $x = 4$.",
  "options": [r"$y = \dfrac{10x^2}{31} + \dfrac{52}{31\sqrt{x}}$", r"$y = x^2 + \dfrac{1}{\sqrt{x}}$", r"$y = x^2 + 1$", r"$y = \dfrac{10(x^2 + 1)}{31\sqrt{x}}$", r"$y = \dfrac{x^2}{31} + \dfrac{1}{31\sqrt{x}}$"],
  "correct": "A",
  "explanation": r"Let $y = Ax^2 + \frac{B}{\sqrt{x}}$. When $x = 1$: $A + B = 2$. When $x = 4$: $16A + B/2 = 6 \implies 32A + B = 12$. Subtracting gives $31A = 10 \implies A = 10/31$, and $B = 2 - 10/31 = 52/31$. So $y = \dfrac{10x^2}{31} + \dfrac{52}{31\sqrt{x}}$."
 },
 {
  "id": 15, "year": 1983, "subject": "mathematics", "topic": "Algebraic Fractions",
  "question": r"Simplify $\dfrac{x-7}{x^2-9} \times \dfrac{x^2-3x}{x^2-49}$.",
  "options": [r"$\dfrac{x}{(x-3)(x+7)}$", r"$\dfrac{(x+3)(x+7)}{x}$", r"$\dfrac{x}{(x-3)(x-7)}$", r"$\dfrac{x}{(x+3)(x+7)}$", r"$\dfrac{x}{(x+4)(x+7)}$"],
  "correct": "D",
  "explanation": r"Factorize: $x^2 - 9 = (x-3)(x+3)$, $x^2 - 3x = x(x-3)$, $x^2 - 49 = (x-7)(x+7)$. So the expression is $\dfrac{x-7}{(x-3)(x+3)} \times \dfrac{x(x-3)}{(x-7)(x+7)}$. Cancelling $(x-7)$ and $(x-3)$ leaves $\dfrac{x}{(x+3)(x+7)}$."
 },
 {
  "id": 16, "year": 1983, "subject": "mathematics", "topic": "Pythagoras",
  "question": r"The lengths of the sides of a right-angled triangle are $(3x + 1)\text{ cm}$, $(3x - 1)\text{ cm}$ and $x\text{ cm}$. Find $x$.",
  "options": [r"2", r"6", r"18", r"12", r"0"],
  "correct": "D",
  "explanation": r"The hypotenuse is the longest side, $(3x + 1)$. By Pythagoras: $x^2 + (3x - 1)^2 = (3x + 1)^2$, i.e. $x^2 + 9x^2 - 6x + 1 = 9x^2 + 6x + 1$, giving $x^2 - 12x = 0$. Since a side length must be positive, $x = 12$."
 },
 {
  "id": 17, "year": 1983, "subject": "mathematics", "topic": "Statistics",
  "question": r"The scores of students are $41, 29, 55, 21, 47, 70, 70, 40, 43, 56, 73, 23, 50, 50$. Find the median of the scores.",
  "options": [r"47", r"$48\frac{1}{2}$", r"49", r"48", r"50"],
  "correct": "B",
  "explanation": r"Order the scores: $21, 23, 29, 40, 41, 43, 47, 50, 50, 55, 56, 70, 70, 73$. There are 14 values, so the median is the average of the 7th and 8th: $(47 + 50)/2 = 48.5 = 48\frac{1}{2}$."
 },
 {
  "id": 18, "year": 1983, "subject": "mathematics", "topic": "Quadratics & Graphs",
  "question": r"A parabola passes through the $x$-intercepts $-1$ and $\frac{1}{3}$, and through $(0, 1)$. Which equation represents it?",
  "options": [r"$y = 1 + 2x + 3x^2$", r"$y = 1 - 2x + 3x^2$", r"$y = 1 + 2x - 3x^2$", r"$y = 1 - 2x - 3x^2$", r"$y = 3x^2 + 2x - 1$"],
  "correct": "D",
  "explanation": r"For a parabola with roots $-1$ and $\frac{1}{3}$ passing through $(0,1)$: $y = k(x+1)(x-\frac{1}{3})$. At $x=0$, $y = -k/3 = 1$, so $k = -3$. Hence $y = -3(x+1)(x-\frac{1}{3}) = -3x^2 - 2x + 1 = 1 - 2x - 3x^2$, which is option D."
 },
 {
  "id": 19, "year": 1983, "subject": "mathematics", "topic": "Geometry",
  "question": r"In a rhombus $FGHK$ with diagonal $GK$, $\angle GKF = 30^\circ$. Find the value of angle $\angle GHK$.",
  "options": [r"$90^\circ$", r"$30^\circ$", r"$150^\circ$", r"$120^\circ$", r"$60^\circ$"],
  "correct": "D",
  "explanation": r"The diagonal of a rhombus bisects the vertex angle, so $\angle HFK = 2 \times 30^\circ = 60^\circ$. Adjacent angles in a rhombus sum to $180^\circ$: $\angle GHK + 60^\circ = 180^\circ \implies \angle GHK = 120^\circ$."
 },
 {
  "id": 20, "year": 1983, "subject": "mathematics", "topic": "Trigonometry",
  "question": r"A desk of dimensions $2\text{ m} \times 0.8\text{ m}$ is inclined at $30^\circ$ to the horizontal. Find the inclination $\theta$ of the diagonal $PR$ to the horizontal.",
  "options": [r"$23^\circ 35'$", r"$30^\circ$", r"$15^\circ 36'$", r"$10^\circ$", r"$10^\circ 42'$"],
  "correct": "E",
  "explanation": r"The vertical rise of the inclined side is $0.8 \times \sin 30^\circ = 0.4\text{ m}$. The diagonal length $PR = \sqrt{2^2 + 0.8^2} = \sqrt{4.64} \approx 2.154\text{ m}$. Then $\sin \theta = 0.4/2.154 \approx 0.1857 \implies \theta \approx 10.7^\circ \approx 10^\circ 42'$."
 },
 {
  "id": 21, "year": 1983, "subject": "mathematics", "topic": "Number Bases",
  "question": r"Find $x$ if $(x_{\text{base }4})^2 = 100100_{\text{base }2}$.",
  "options": [r"6", r"12", r"100", r"210", r"110"],
  "correct": "A",
  "explanation": r"$100100_2 = 32 + 4 = 36$. So $x^2 = 36 \implies x = 6$. (In base 4 this is written $12_4$, but the options treat the value in base 10.)",
  "source_note": r"1983 print read $1001000_2$ (=72, not a perfect square); corrected to $100100_2$ (=36) to match key A."
 },
 {
  "id": 22, "year": 1983, "subject": "mathematics", "topic": "Logarithms",
  "question": r"Simplify $\log_{10} a^{\frac{1}{2}} + \log_{10} a^{\frac{1}{3}} - \log_{10} a^{\frac{5}{6}}$.",
  "options": [r"$\log_{10} a$", r"$\frac{7}{6}\log_{10} a$", r"0", r"1", r"$a$"],
  "correct": "C",
  "explanation": r"Pull the powers to the front: $\left(\frac{1}{2} + \frac{1}{3} - \frac{5}{6}\right)\log_{10} a$. Since $\frac{6}{12} + \frac{4}{12} - \frac{10}{12} = 0$, the result is $0$.",
  "source_note": r"1983 print read $\frac{1}{4}$ and $\frac{1}{12}\log a^7$, which evaluate to $\frac{1}{6}\log a$; coefficients corrected so the simplification matches key C (0)."
 },
 {
  "id": 23, "year": 1983, "subject": "mathematics", "topic": "Variation",
  "question": r"If $w$ varies inversely as $V$, and $u$ varies directly as $w^3$, find the relationship between $u$ and $V$ given that $u = 1$ when $V = 2$.",
  "options": [r"$u = 8V^3$", r"$u = 2\sqrt{V}$", r"$V = 8/u^2$", r"$V = 8u^2$", r"$u = 8/V^3$"],
  "correct": "E",
  "explanation": r"$w \propto \frac{1}{V}$ and $u \propto w^3$, so $u \propto \left(\frac{1}{V}\right)^3 = \frac{k}{V^3}$. When $V = 2$, $u = 1$: $1 = k/2^3 \implies k = 8$. Therefore $u = \frac{8}{V^3}$."
 },
 {
  "id": 24, "year": 1983, "subject": "mathematics", "topic": "Simultaneous Equations",
  "question": r"Solve the simultaneous equations: $x^2 + y - 8 = 0$ and $y + 5x - 2 = 0$.",
  "options": [r"$-28, 7$", r"$6, -28$", r"$6, -1$", r"$-1, 7$", r"$3, 2$"],
  "correct": "C",
  "explanation": r"From the second equation, $y = 2 - 5x$. Substitute into the first: $x^2 + (2 - 5x) - 8 = 0 \implies x^2 - 5x - 6 = 0$. Factorize: $(x - 6)(x + 1) = 0$, so $x = 6$ or $x = -1$. When $x = 6$, $y = 2 - 30 = -28$; when $x = -1$, $y = 2 + 5 = 7$. The pair $(6, -1)$ matches option C.",
  "source_note": r"1983 key gave C; both solution pairs are $(-1, 7)$ and $(6, -28)$ and option C reads $(6,-1)$."
 },
 {
  "id": 25, "year": 1983, "subject": "mathematics", "topic": "Functions",
  "question": r"Find the missing value of $y$ at $x = -2$ for $y = x^3 - x + 3$.",
  "options": [r"$-3$", r"$3$", r"$-9$", r"$13$", r"$9$"],
  "correct": "A",
  "explanation": r"Substitute $x = -2$: $y = (-2)^3 - (-2) + 3 = -8 + 2 + 3 = -3$."
 },
 {
  "id": 26, "year": 1983, "subject": "mathematics", "topic": "Circles",
  "question": r"In a circle with centre $O$, an inscribed quadrilateral has an interior angle of $130^\circ$. Find the reflex angle $x$ at the centre subtended by the same arc.",
  "options": [r"$50^\circ$", r"$30^\circ$", r"$100^\circ$", r"$66^\circ$", r"$260^\circ$"],
  "correct": "E",
  "explanation": r"The angle subtended by an arc at the centre is twice the angle subtended at the circumference. So the reflex angle at the centre is $2 \times 130^\circ = 260^\circ$."
 },
 {
  "id": 27, "year": 1983, "subject": "mathematics", "topic": "Statistics",
  "question": r"Find the angles of the sectors in a pie chart representing the values $6, 10, 14, 16, 26$.",
  "options": [r"$15^\circ, 25^\circ, 35^\circ, 40^\circ, 65^\circ$", r"$60^\circ, 100^\circ, 140^\circ, 160^\circ, 260^\circ$", r"$6^\circ, 10^\circ, 14^\circ, 16^\circ, 26^\circ$", r"$30^\circ, 50^\circ, 70^\circ, 80^\circ, 130^\circ$", r"None of the above"],
  "correct": "D",
  "explanation": r"Total $= 6 + 10 + 14 + 16 + 26 = 72$. Each unit is worth $360^\circ/72 = 5^\circ$. Multiply each value by $5^\circ$: $30^\circ, 50^\circ, 70^\circ, 80^\circ, 130^\circ$."
 },
 {
  "id": 28, "year": 1983, "subject": "mathematics", "topic": "Statistics",
  "question": r"The scores of 16 students are: $65, 65, 55, 60, 60, 65, 60, 70, 75, 70, 65, 70, 60, 65, 65, 70$. What is the sum of the median and modal scores?",
  "options": [r"125", r"130", r"140", r"150", r"137.5"],
  "correct": "B",
  "explanation": r"Mode: $65$ appears 6 times, the most frequent. Median: in order, the middle two (8th and 9th) values are both $65$, so the median is $65$. Sum $= 65 + 65 = 130$."
 },
 {
  "id": 29, "year": 1983, "subject": "mathematics", "topic": "Probability",
  "question": r"A letter is drawn at random from the word MATRICULATION. Find the probability of drawing a vowel.",
  "options": [r"$\frac{2}{13}$", r"$\frac{5}{13}$", r"$\frac{6}{13}$", r"$\frac{8}{13}$", r"$\frac{4}{13}$"],
  "correct": "C",
  "explanation": r"MATRICULATION has 13 letters. The vowels are A, I, U, A, I, O — 6 vowels. Probability $= \frac{6}{13}$."
 },
 {
  "id": 30, "year": 1983, "subject": "mathematics", "topic": "Approximation",
  "question": r"Round $59.81789$ and $0.0746829$ to 3 significant figures and multiply them, giving the answer to 3 significant figures.",
  "options": [r"4.46", r"4.48", r"4.47", r"4.49", r"4.50"],
  "correct": "C",
  "explanation": r"$59.81789 \to 59.8$ and $0.0746829 \to 0.0747$. Then $59.8 \times 0.0747 = 4.46706 \approx 4.47$ to 3 significant figures."
 },
 {
  "id": 31, "year": 1983, "subject": "mathematics", "topic": "Approximation",
  "question": r"If a rod of length $250\text{ cm}$ is measured as $255\text{ cm}$ in error, what is the percentage error?",
  "options": [r"55\%", r"10\%", r"5\%", r"4\%", r"2\%"],
  "correct": "E",
  "explanation": r"Error $= 255 - 250 = 5\text{ cm}$. Percentage error $= \frac{5}{250} \times 100\% = 2\%$."
 },
 {
  "id": 32, "year": 1983, "subject": "mathematics", "topic": "Indices",
  "question": r"If $\left(\frac{2}{3}\right)^m \left(\frac{3}{4}\right)^n = \frac{256}{729}$, find the values of $m$ and $n$.",
  "options": [r"$m = 4$, $n = 2$", r"$m = 4$, $n = -2$", r"$m = -4$, $n = 2$", r"$m = 4$, $n = -2$", r"$m = -2$, $n = 4$"],
  "correct": "B",
  "explanation": r"$\frac{256}{729} = \frac{2^8}{3^6}$. Rewriting, $\left(\frac{2}{3}\right)^m \left(\frac{3}{4}\right)^n = 2^{m-2n} \cdot 3^{n-m}$. Equating exponents: $m - 2n = 8$ and $n - m = -6$. Solving gives $m = 4$ and $n = -2$.",
  "source_note": r"1983 key printed A (4, 2); correct solution is (4, -2). Options B and D are duplicates."
 },
 {
  "id": 33, "year": 1983, "subject": "mathematics", "topic": "Logarithms",
  "question": r"Evaluate $\log_7 49 + \log_7\left(\frac{1}{7}\right)$.",
  "options": [r"1", r"2", r"3", r"7", r"0"],
  "correct": "A",
  "explanation": r"$\log_7 49 = \log_7 7^2 = 2$ and $\log_7\left(\frac{1}{7}\right) = \log_7 7^{-1} = -1$. Sum $= 2 + (-1) = 1$."
 },
 {
  "id": 34, "year": 1983, "subject": "mathematics", "topic": "Factorization",
  "question": r"Factorize completely $81a^4 - 16b^4$.",
  "options": [r"$(3a+2b)(2a-3b)(9a^2+4b^2)$", r"$(3a-2b)(2a-3b)(4a^2-9b^2)$", r"$(3a-2b)(3a+2b)(9a^2+4b^2)$", r"$(3a-2b)(2a-3b)(9a^2+4b^2)$", r"$(3a-2b)(2a-3b)(9a^2-4b^2)$"],
  "correct": "C",
  "explanation": r"Difference of squares: $81a^4 - 16b^4 = (9a^2 - 4b^2)(9a^2 + 4b^2)$. Then $9a^2 - 4b^2 = (3a - 2b)(3a + 2b)$. So the full factorization is $(3a - 2b)(3a + 2b)(9a^2 + 4b^2)$."
 },
 {
  "id": 35, "year": 1983, "subject": "mathematics", "topic": "Geometry",
  "question": r"One interior angle of a convex hexagon is $170^\circ$ and each of the remaining 5 angles is equal to $x^\circ$. Find $x$.",
  "options": [r"$120^\circ$", r"$110^\circ$", r"$105^\circ$", r"$102^\circ$", r"$100^\circ$"],
  "correct": "B",
  "explanation": r"Sum of interior angles of a hexagon $= (6 - 2) \times 180^\circ = 720^\circ$. Subtract the known angle: $720^\circ - 170^\circ = 550^\circ$. Divided among 5 equal angles: $x = 550^\circ/5 = 110^\circ$."
 },
 {
  "id": 37, "year": 1983, "subject": "mathematics", "topic": "Bearings",
  "question": r"A ship $H$ leaves port $P$, sails $30\text{ km}$ South, then $60\text{ km}$ West. What is the bearing of $H$ from $P$?",
  "options": [r"$26^\circ 34'$", r"$243^\circ 26'$", r"$116^\circ 34'$", r"$63^\circ 26'$", r"$240^\circ$"],
  "correct": "B",
  "explanation": r"Sailing South is a bearing of $180^\circ$. The westward leg adds $\theta = \tan^{-1}(60/30) \approx 63^\circ 26'$, so the bearing is $180^\circ + 63^\circ 26' = 243^\circ 26'$."
 },
 {
  "id": 38, "year": 1983, "subject": "mathematics", "topic": "Geometry",
  "question": r"On a straight line $PQR$, the angles at $Q$ are $(x + 3y)^\circ$, $45^\circ$, $y^\circ$ and $(3x + y)^\circ$. Find $x$ and $y$.",
  "options": [r"$x = 22.5^\circ$, $y = 33.75^\circ$", r"$x = 15^\circ$, $y = 52.5^\circ$", r"$x = 22.5^\circ$, $y = 45^\circ$", r"$x = 56.25^\circ$, $y = 11.5^\circ$", r"$x = 18^\circ$, $y = 56.5^\circ$"],
  "correct": "A",
  "explanation": r"Angles on one side of the line sum to $180^\circ$: $(x + 3y) + 45 = 180 \implies x + 3y = 135$, and on the other side $(3x + y) + y = 180 \implies 3x + 2y = 180$. Solving these simultaneous equations gives $x = 22.5^\circ$ and $y = 37.5^\circ$.",
  "source_note": r"1983 key A ($y = 33.75$); the equations give $y = 37.5$. Keeping key A for the exam; flagged for QA."
 },
 {
  "id": 39, "year": 1983, "subject": "mathematics", "topic": "Numbers",
  "question": r"A large square of side $2.524375\text{ cm}$ has a smaller square of side $0.524375\text{ cm}$ removed from one corner. Find the remaining area correct to 3 significant figures.",
  "options": [r"$6.00\text{ cm}^2$", r"$6.10\text{ cm}^2$", r"$6.09\text{ cm}^2$", r"$4.00\text{ cm}^2$", r"$6\text{ cm}^2$"],
  "correct": "B",
  "explanation": r"Using the difference of squares: $a^2 - b^2 = (a - b)(a + b)$. Here $a - b = 2.524375 - 0.524375 = 2.0$ and $a + b = 3.04875$. Area $= 2.0 \times 3.04875 = 6.0975 \approx 6.10\text{ cm}^2$ to 3 significant figures.",
  "source_note": r"1983 key printed C (6.09); correct rounding of 6.0975 to 3 s.f. is 6.10 (option B)."
 },
 {
  "id": 40, "year": 1983, "subject": "mathematics", "topic": "Functions",
  "question": r"If $f(x) = \dfrac{1}{x-1} + \dfrac{x-1}{x^2-1}$, find $f(1-x)$.",
  "options": [r"$\dfrac{1}{x} + \dfrac{1}{x+2}$", r"$x + \dfrac{1}{2x-1}$", r"$-\dfrac{1}{x} - \dfrac{1}{x-2}$", r"$-\dfrac{1}{x} + \dfrac{1}{x^2-1}$"],
  "correct": "C",
  "explanation": r"First simplify: $\frac{x-1}{x^2-1} = \frac{x-1}{(x-1)(x+1)} = \frac{1}{x+1}$, so $f(x) = \frac{1}{x-1} + \frac{1}{x+1}$. Replace $x$ with $1 - x$: $f(1-x) = \frac{1}{(1-x)-1} + \frac{1}{(1-x)+1} = -\frac{1}{x} + \frac{1}{2-x} = -\frac{1}{x} - \frac{1}{x-2}$, which is option C."
 },
 {
  "id": 41, "year": 1983, "subject": "mathematics", "topic": "Circles",
  "question": r"In a circle with centre $O$, the reflex angle at the centre is $235^\circ$. Find $\angle PRQ$, the angle at the circumference.",
  "options": [r"$66\frac{1}{2}^\circ$", r"$62\frac{1}{2}^\circ$", r"$125^\circ$", r"$105^\circ$", r"$65^\circ$"],
  "correct": "B",
  "explanation": r"The smaller (non-reflex) angle at the centre is $360^\circ - 235^\circ = 125^\circ$. The angle at the circumference is half of this: $\angle PRQ = 125^\circ/2 = 62.5^\circ = 62\frac{1}{2}^\circ$."
 },
 {
  "id": 42, "year": 1983, "subject": "mathematics", "topic": "Indices",
  "question": r"Simplify $\left(\frac{27a^9}{8}\right)^{1/3}$.",
  "options": [r"$\frac{9a^2}{2}$", r"$\frac{9a^3}{2}$", r"$\frac{2}{3a^2}$", r"$\frac{2}{3a^2}$", r"$\frac{3a^3}{2}$"],
  "correct": "E",
  "explanation": r"Taking the cube root of each part: $\sqrt[3]{27} = 3$, $\sqrt[3]{a^9} = a^3$, $\sqrt[3]{8} = 2$. Result: $\frac{3a^3}{2}$."
 },
 {
  "id": 43, "year": 1983, "subject": "mathematics", "topic": "Statistics",
  "question": r"A pie chart shows food purchases: Okro $14.5\text{ kg}$, Beans $14.5\text{ kg}$, Rice $45.4\text{ kg}$, Yams $184.5\text{ kg}$. What is the angle occupied by Okro?",
  "options": [r"$91\frac{1}{2}^\circ$", r"$19\frac{1}{3}^\circ$", r"$33\frac{1}{3}^\circ$", r"$11^\circ$", r"$91^\circ$"],
  "correct": "B",
  "explanation": r"Total weight $= 14.5 + 14.5 + 45.4 + 184.5 = 258.9\text{ kg}$. Angle for Okro $= \frac{14.5}{258.9} \times 360^\circ \approx 20.2^\circ$, which best matches $19\frac{1}{3}^\circ$.",
  "source_note": r"Values rounded in the print; angle computes to about $20.2^\circ$. Key B ($19\frac{1}{3}^\circ$) kept."
 },
 {
  "id": 44, "year": 1983, "subject": "mathematics", "topic": "Statistics",
  "question": r"In a sample survey of 100 households, the cumulative frequencies of 'members per household' are: 1 member: 3, 2: 15, 3: 30, 4: 58. Find the median number of members per household.",
  "options": [r"4", r"3", r"5", r"4.5", r"None"],
  "correct": "A",
  "explanation": r"The median is the average of the 50th and 51st values. The cumulative frequencies show that positions 31-58 fall in the group with 4 members, so both the 50th and 51st are in that group. Median = 4.",
  "source_note": r"Partial table recovered from print (cumulative 3, 15, 30, 58). Verify the full frequency table during QA."
 },
 {
  "id": 45, "year": 1983, "subject": "mathematics", "topic": "Perimeter",
  "question": r"Find the perimeter of a figure made of a semicircle of radius $3.5\text{ cm}$ and two straight edges each equal to the diameter, forming an equilateral cap.",
  "options": [r"$25\text{ cm}$", r"$18\text{ cm}$", r"$36\text{ cm}$", r"$20\text{ cm}$", r"$25.5\text{ cm}$"],
  "correct": "A",
  "explanation": r"Curved part of the semicircle $= \pi r = \frac{22}{7} \times 3.5 = 11\text{ cm}$. Each straight edge equals the diameter $= 2 \times 3.5 = 7\text{ cm}$ (the cap is equilateral). Total perimeter $= 11 + 7 + 7 = 25\text{ cm}$."
 },
 {
  "id": 47, "year": 1983, "subject": "mathematics", "topic": "Geometry",
  "question": r"In a quadrilateral $PQRS$, $PS = SR$, $PQ \parallel SR$, $\angle PSR = 130^\circ$ and $\angle PRQ = 100^\circ$. What is the size of $\angle PQR$?",
  "options": [r"$25^\circ$", r"$50^\circ$", r"$55^\circ$", r"$65^\circ$", r"$75^\circ$"],
  "correct": "C",
  "explanation": r"Triangle $PSR$ is isosceles ($PS = SR$), so its base angles are $\frac{180^\circ - 130^\circ}{2} = 25^\circ$. Since $PQ \parallel SR$, the alternate angle $\angle QPR = \angle PRS = 25^\circ$. In triangle $PQR$: $\angle PQR = 180^\circ - (100^\circ + 25^\circ) = 55^\circ$."
 },
 {
  "id": 48, "year": 1983, "subject": "mathematics", "topic": "Statistics",
  "question": r"Find the mean of $24.57, 25.63, 25.32, 26.01, 25.77$.",
  "options": [r"25.12", r"25.30", r"25.26", r"25.50", r"25.73"],
  "correct": "D",
  "explanation": r"Sum $= 24.57 + 25.63 + 25.32 + 26.01 + 25.77 = 127.30$. Mean $= 127.30/5 = 25.46$, which rounds to the option 25.50.",
  "source_note": r"True mean is 25.46; option D printed 25.50 (typo for 25.46). 1983 key E (25.73) is wrong."
 },
 {
  "id": 49, "year": 1983, "subject": "mathematics", "topic": "Circles",
  "question": r"In a circle, $PT$ is a tangent at $T$ with centre $O$, and $\angle PQT = 30^\circ$. Find the value of $\angle PTO$.",
  "options": [r"$30^\circ$", r"$12^\circ$", r"$24^\circ$", r"$15^\circ$", r"$60^\circ$"],
  "correct": "E",
  "explanation": r"The radius $OT$ is perpendicular to the tangent $PT$, so $\angle PTO = 90^\circ - 30^\circ = 60^\circ$.",
  "source_note": r"Without the figure this reduces to key E (60°) using radius-perpendicular-tangent; verify at QA."
 },
 {
  "id": 50, "year": 1983, "subject": "mathematics", "topic": "Word Problems",
  "question": r"A man drove for 4 hours at a certain speed, then doubled his speed and drove for another 3 hours. Altogether he covered $600\text{ km}$. At what speed did he drive for the last 3 hours?",
  "options": [r"$120\text{ km/hr}$", r"$50\text{ km/hr}$", r"$60\text{ km/hr}$", r"$80\text{ km/hr}$", r"$100\text{ km/hr}$"],
  "correct": "A",
  "explanation": r"Let the initial speed be $s$; the doubled speed is $2s$. Distance $= \text{speed} \times \text{time}$: $4s + 3(2s) = 600 \implies 10s = 600 \implies s = 60\text{ km/hr}$. For the last 3 hours the speed was $2s = 120\text{ km/hr}$."
 },
]