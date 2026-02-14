# Mathematical Expressions Guide - AKU Concept Hub

## Overview
Your blog system now fully supports mathematical expressions using **KaTeX** rendering. All mathematical content is automatically rendered beautifully in both the admin preview and on published blogs.

---

## How to Write Math Expressions

### 1. **Inline Math** (within text)
Use single dollar signs `$...$` for inline mathematical expressions.

**Example:**
```
The quadratic formula is $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$ which solves ax² + bx + c = 0.
```

**Renders as:**
The quadratic formula is rendered inline with the surrounding text.

---

### 2. **Display Math** (Centered on own line)
Use double dollar signs `$$...$$` for display mode (larger, centered).

**Example:**
```
$$
\int_a^b f(x) \, dx = F(b) - F(a)
$$
```

**Renders as:** 
Centered, larger formula on its own line.

---

### 3. **LaTeX Notation (Alternative)**
You can also use LaTeX's notation:
- Inline: `\(...\)` 
- Display: `\[...\]`

**Example:**
```
\[E = mc^2\]
```

---

## Common Math Expressions for Grade 9-10 Curriculum

### Algebra
```
# Linear Equations
$ax + b = c$

# Quadratic Formula
$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

# Factoring
$(a+b)(a-b) = a^2 - b^2$

# Exponent Rules
$a^m \cdot a^n = a^{m+n}$
```

### Geometry
```
# Pythagorean Theorem
$$a^2 + b^2 = c^2$$

# Area of Circle
$$A = \pi r^2$$

# Area of Polygon
$$A = \frac{1}{2} \times \text{base} \times \text{height}$$

# Volume of Sphere
$$V = \frac{4}{3}\pi r^3$$
```

### Trigonometry
```
# Sine, Cosine, Tangent
$$\sin(\theta) = \frac{\text{opposite}}{\text{hypotenuse}}$$

$$\cos(\theta) = \frac{\text{adjacent}}{\text{hypotenuse}}$$

$$\tan(\theta) = \frac{\sin(\theta)}{\cos(\theta)}$$

# Pythagorean Identity
$$\sin^2(\theta) + \cos^2(\theta) = 1$$
```

### Calculus
```
# Derivative
$$\frac{d}{dx}[f(x)] = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}$$

# Integral
$$\int f(x) \, dx = F(x) + C$$

# Power Rule
$$\frac{d}{dx}[x^n] = nx^{n-1}$$
```

### Physics
```
# Newton's Second Law
$$F = ma$$

# Work
$$W = F \cdot d \cdot \cos(\theta)$$

# Kinetic Energy
$$KE = \frac{1}{2}mv^2$$

# Potential Energy
$$PE = mgh$$

# Ohm's Law
$$V = IR$$
```

### Chemistry
```
# Molar Mass
$$M = \frac{m}{n}$$

# Concentration (Molarity)
$$M = \frac{\text{moles}}{\text{liters}} = \frac{n}{V}$$

# pH Definition
$$\text{pH} = -\log_{10}[H^+]$$

# Gas Constant
$$PV = nRT$$
```

### Statistics
```
# Mean/Average
$$\bar{x} = \frac{\sum_{i=1}^{n} x_i}{n}$$

# Variance
$$\sigma^2 = \frac{1}{n}\sum_{i=1}^{n}(x_i - \bar{x})^2$$

# Standard Deviation
$$\sigma = \sqrt{\sigma^2}$$

# Probability
$$P(A) = \frac{\text{favorable outcomes}}{\text{total outcomes}}$$
```

---

## Advanced Formatting

### Fractions
```
$\frac{numerator}{denominator}$
$$\frac{a+b}{c+d}$$
```

### Exponents & Subscripts
```
$x^2$ (exponent)
$x_i$ (subscript)
$x^{n+1}$ (multi-char exponent)
$a_{ij}$ (multi-char subscript)
```

### Roots
```
$\sqrt{x}$ (square root)
$\sqrt[n]{x}$ (nth root)
$$\sqrt{\frac{a}{b}}$$
```

### Greek Letters
```
$\alpha, \beta, \gamma, \delta, \theta, \lambda, \pi, \sigma, \omega$

$$\alpha = \frac{\pi}{2}$$
```

### Matrices & Systems
```
$$\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}$$

$$\begin{cases}
x + y = 5 \\
2x - y = 1
\end{cases}$$
```

### Summation & Products
```
# Summation
$$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$

# Product
$$\prod_{i=1}^{n} x_i$$

# Limit
$$\lim_{x \to 0} \frac{\sin(x)}{x} = 1$$
```

### Functions & Operators
```
sin, cos, tan, log, ln, exp, min, max, etc.
$$\sin(x) + \cos(x)$$
$$\log_2(8) = 3$$
$$\exp(x) = e^x$$
```

### Special Symbols
```
$\pm$ (plus-minus)
$\times$ (multiplication)
$\div$ (division)
$\leq, \geq, \neq$ (comparison)
$\approx$ (approximately)
$\infty$ (infinity)
$\in, \notin$ (set membership)
$\forall$ (for all)
$\exists$ (there exists)
```

---

## Complete Blog Example

```markdown
# Solving Quadratic Equations

## Introduction
A quadratic equation is any equation of the form:

$$ax^2 + bx + c = 0$$

where $a \neq 0$, and $a$, $b$, $c$ are constants.

## The Quadratic Formula
The most reliable method is using the quadratic formula:

$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

### Finding the Discriminant
The discriminant is:
$$\Delta = b^2 - 4ac$$

- If $\Delta > 0$: Two distinct real roots
- If $\Delta = 0$: One repeated real root
- If $\Delta < 0$: Two complex conjugate roots

## Example Problem
Solve: $2x^2 + 5x - 3 = 0$

**Solution:**
- $a = 2$, $b = 5$, $c = -3$
- $\Delta = 5^2 - 4(2)(-3) = 25 + 24 = 49$

$$x = \frac{-5 \pm \sqrt{49}}{2(2)} = \frac{-5 \pm 7}{4}$$

Therefore: $x_1 = \frac{2}{4} = \frac{1}{2}$ and $x_2 = \frac{-12}{4} = -3$

## Factoring Method
For equations that factor nicely:

$$2x^2 + 5x - 3 = (2x - 1)(x + 3) = 0$$

So $x = \frac{1}{2}$ or $x = -3$

## Key Takeaways
- Always identify $a$, $b$, $c$ first
- The discriminant tells you about the nature of roots
- The quadratic formula works for ALL quadratic equations
- Factoring is faster when possible
```

---

## How to Use in Your Blog Posts

### In Admin Dashboard
1. Go to **Blog Management** tab
2. Write your blog content in the **Write** mode
3. Use the math syntax above
4. Click **Preview** to see how it renders
5. Math expressions will appear beautifully formatted

### On Published Blogs
- Visitors see all mathematical expressions properly rendered
- Math is responsive and scales on all devices
- No additional setup needed - it's automatic!

### In the N8N Workflow
When using the N8N automation to generate blog content, instruct the AI model:

```
Include mathematical expressions in LaTeX format using these delimiters:
- Inline math: $expression$
- Display math: $$expression$$

For example:
"The formula is $E = mc^2$ which shows..."
or
"$$\int_a^b f(x) dx = F(b) - F(a)$$"
```

---

## Troubleshooting

### Math Not Rendering?
1. **Check delimiters**: Use `$...$` or `$$...$$`
2. **Avoid currency**: `$50` is free text, use `\$50` or `$50 USD`
3. **Escape backslashes**: In most cases, one backslash is fine: `\frac{a}{b}`

### Error Messages?
- "Math Error" boxes show when syntax is invalid
- Check LaTeX syntax at: https://www.codecogs.com/eqnedit.php
- Or use: https://www.overleaf.com/learn/latex/Mathematical_expressions

### Performance
- Math rendering is cached automatically
- Large documents with 50+ equations render instantly
- No performance impact on your website

---

## Resources

- **KaTeX Supported Functions**: https://katex.org/docs/supported.html
- **LaTeX Math Tutorial**: https://www.overleaf.com/learn/latex/Mathematical_expressions
- **Quick Reference**: https://www.cmor-faculty.rice.edu/~heinken/latex/node56.html

---

## Tips for Pakistani Curriculum

### for Grade 9
Focus on:
- Algebraic equations: $ax + b = c$
- Quadratic equations: $ax^2 + bx + c = 0$
- Basic trigonometry: $\sin(\theta), \cos(\theta), \tan(\theta)$
- Area & Volume formulas

### For Grade 10
Expand to:
- Advanced polynomials
- Complex numbers
- Calculus basics: derivatives and integrals
- Advanced statistics

---

**Enjoy creating beautiful, mathematically-rich blog content! 🎓📐**
