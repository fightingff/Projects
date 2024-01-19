# Logic and Computer Design Fundamentals

~~*this review mainly focus on some special points and terminology*~~

## Some Special Codes

- **BCD**

> 4 Binary bit as a Decimal bit
> Simply flatten up in converting

- *Excess 3 code*

    - BCD + 3

    - easy to do adding(automatically add carry)

- **Gray**

> Flip only one bit each turn
> $Gray Code = (K)_2 \ \ xor \ \ ((K)_2 >> 1)$
> *Useful in K-map and optimization!*

- **Parity Bit**

  - odd parity & even parity
      - Final result of 1's

  - MSB & LSB
      - Most/Least Significant Bit

- **Unsigned integer**

  - **Radix Complement(补码)**

    - r’s complement for radix r
    - 2’s complement in binary
    - Defined as $r^N - x$
    - *In Binary, as (~x + 1)*

  - **Diminished Radix Complement（反码）**

    - (r - 1)’s complement for radix r
    - 1’s complement for radix 2
    - Defined as $r^N - 1 - x$ , "flipping" every bit actually
 
- **Signed integer**

    - positive
        - Both 1's and 2's complement are the same as true code

    - negative
        - 1's complement is flipping every bit follow the sign bit
        - 2's complement is 1's complement + 1

## Arithmetic System

- In computer system, it's actually a **"$mod \ r^N$"** system for N bit calculation
- $X - Y \equiv X + r^N - Y \equiv X + \overline{Y}(mod \ r^N)$
- **Unsigned Subtraction**

    - Use 2's Complement, then the answer actually is $X - Y + r^N$
    - Thus check the final carry bit(actually Nth bit)
        - 1 : $X \geq Y$, result is answer
        - 0 : $X < Y$, answer is negative, thus the answer is $-(r^N - result)$

- **Signed Subtraction**

    - Just use 2's Complement to convert subtraction into addition

- **Overflow**

    - Unsigned
        - Extra carry bit in addition

    - Signed
        - (+A) + (+B) = (-C)
        - (-A) + (-B) = (+C)

## Boolean Algebra

- Dual
    - Interchange only And/Or
- Complement
    - DeMorgan's Law
- Duality Rules

> A boolean equation remains valid if we take
> the dual of the expressions on both sides of the equals sign

- Important Formulars

    - $X + XY = X$
    - $X(X+Y) = X$
    - $XY + X \overline{Y} = X$
    - $(X+Y)(X+\overline{Y})=X$
    - **$X + \overline{X}Y = X + Y$**
    - **$X(\overline{X}+Y)=XY$**
- **Consensus Theorem**

> $XY+\overline{X}Z+YZ=XY+\overline{X}Z$            (YZ is redundant)
> $(X+Y)(\overline{X}+Z)(Y+Z)=(X+Y)(\overline{X}+Z)$        (dual)

- **Canonical Form**
    - SOM (sum of miniterm)
        - Choose 1's
    - POM (product of maxterm)
        - Choose 0's
    - SOP (sum of product)
        - Choose 1's
        - Every product term contains all variables
  - **Cost**
      - Literal cost
        - Number of literals
      - Gate-input cost
        - Input wires (literal cost + combinational structure)
      - Gate-input cost with NOTs
        - Gate-input cost + NOTs (**count every literal only once**)
  - **K-map**
      - Implicant
        - A product term in SOP
      - Prime Implicant
        - A product term obtained by combining the maximum possible number of adjacent squares in the map with $2^N$ number of squares
      - Essential Prime Implicant
        - Prime Implicant that essentially covers some squares(must pick)
      - Don't cares
        - Self assume the value, mostly choose 1
      - *POS optimization*
        - Optimize the $\overline{F}$ which is SOP

## Combinational Logic

- Delays

  - Transition Time (**Focus on output change**)
      - $t_{LH}=t_r$ : 10% Low to 90% High  (rise)
      - $t_{HL}=t_f$ : 90% High to 10% Low  (fall)
  - Propagation Delay (**Focus on output change by input change**)
      - Time from half of input change to half of output change
      - $t_{pd} = max(t_{pHL}, t_{pLH})$  (sometimes is average)
  - Model
      - Transport Delay
          - $t_{pd}=t_{固有}+k*SL$ (sum of fan-out standard loads)
      - Inertial Delay
          - Rejection Time : rejects narrow “pulses” on the outputs
- Technology Mapping

    - Use NAND/NOR to implement any logic
    - Optimize
        - Push down NOTs
        - Remove redundant gates (linked NOTs)
        - Keep doing

- Decoder

    - $N - 2^N$ One-Hot Decoder
    - Hierarchical Design
        - $N-2^N = (\frac{N}{2} - 2^{\frac{N}{2}} )\times (\frac{N}{2} - 2^{\frac{N}{2}})$
        - Sometimes we can use ENABLE as a select signal

- Encoder

    - $2^N-N$ One-Hot Encoder
    - $2^K-N$ Priority Encoder

- Multiplexer

    - $2^N-1$ MUX
    - Input AND Decoder --OR--> Output
    - Expansion
        - Focus on how to cope with the multi-outputs of several MUXs
    - Implement Combinational Logic Function
        - Simple
            - Input: Output in truth table
            - Select: Input
        - Efficient
            - Divide the input into two parts
            - Select : the first part as the select signal of the second part
            - Input : combination logic of the second part
    - *Use 3-state gate to optimize the cost*

- Demultiplexer

    - $1-2^N$ DeMUX

- Half Adder  (No last carry)

    - $S = A \oplus B$
    - $C = AB$

- Full Adder

    - $S = (A \oplus B)\oplus Z$
    - $C = AB + Z(A \oplus B)$

- Ripple-Carry Binary Adder (*with $\oplus$ gate)

    - Linked Full Adders
    - The first carry 1 means doing subtraction(2's complement)

- **Carry Lookahead Adder*

    - $G_i = A_iB_i$
    - $P_i = A_i \oplus B_i$
    - $C_{i+1} = G_i + P_iC_i$
    - $S_i = P_i \oplus C_i$

- (P)ROM

    - Read-Only Memory
    - Programmable only once
    - $2^K \times N$ ROM ($2^K$ addresses by $K - 2^K$ Decoder, N bits per address)
    - For a given address line, the connected data column is 1, others are 0

- PAL

    - Programmable Array Logic
    - Programmable only once
    - K inputs into 2*K columns($X/\overline{X}$)
    - Fixed structure of N AO, but programmable AND terms
    - One output can be used as input of another output as compensation

- PLA

    - Programmable Logic Array
    - Programmable only once
    - K inputs into 2*K columns($X/\overline{X}$)
    - N programmable AND terms
    - M programmable OR terms (select miniterms above) with M programmable XOR terms (get inverters)
    - Optimize by optimizing both $F/\overline{F}$

- FPGA

    - Field Programmable Gate Array
    - LUT
      - Look-Up Table
      - Like $2^K - 1$ RAM
      - Expansion:
        - Shannon’s expansion theorem : $F = F(X_1, X_2, ..., X_n) = X_nF(X_1, X_2, ..., X_{n-1}, 1) + \overline{X_n}F(X_1, X_2, ..., X_{n-1},0)$
      - **CLB*
        - Configurable Logic Block
        - LUT + Flip-Flop
      - **SM*
        - Switch Matrix
        - Interconnects between CLBs
      - **IOB*
        - Input/Output Block
        - Connects to the outside world

## Sequential Logic

- Synchonous & Asynconous

    - Synchonous : Triggered by discrete clock signal
    - Asynconous : Triggered by input signal

- *Buffer*

    - Store a bit, unable to change
    - Delay = 2 * Inverter Delay

- Analysis

    - Input Equation
        - $D_A = A(t)X(t)$
    - Output Equation
        - $Y(t)= F(A(t),X(t))$
    - Excitation Equation(D Flip-Flop)
        - $D_A = A(t+1)$
        - Function of the current state and next state
    - Next State Equation(Characteristic equation)
        - $A(t+1) = D_A$
        - A function of inputs and the current state

- **Latch**

    - Property
        - Store a bit, able to change and keep
        - Too fast fallback and state change for a sequential circuit (transparent)
    - $S-R$ Latch
        - NOR gates
        - $R---Q$
          $S---\overline{Q}$
        - $S = 1, R = 0,Q = 1$ : Set
        - $S = 0, R = 1,Q = 0$ : Reset
    - $\overline{S}-\overline{R}$ Latch
        - NAND gates
        - $\overline{S}---Q$
          $\overline{R}---\overline{Q}$
        - $S = 1(\overline{S}=0), R = 0,Q=1$ : Set
        - $S = 0, R = 1,Q=0$ : Reset
    - Clocked $S-R$ Latch ($S-R$ Latch with Control Input)
        - Add a control input to control the $\overline{S}-\overline{R}$ latch
        - $\overline{S}$ = S NAND C
    - **Both Latches S=1,Q=1**
    - D Latch
        - Based on $\overline{S}-\overline{R}$ Latch with Control Input
        - Let $S = D, R = \overline{D}$ to avoid the forbidden state
        - Q = D

- **Flip-Flop**

    - **Master - Slave FF**

        - Pulse - Triggered
          - S-R MS FF
            - Master : Clocked S-R Latch
            - Slave : Clocked S-R Latch
            - Control Input : $C$ & $\overline{C}$
            - Every clock cycle only change once (half for master, half for slave)
            - 1's catching problem : glitch
          - J-K MS FF
            - Same as S-R MS FF, but with J-K Latch
            - 1 - 1 state permitted, flip to the opposite state
        - Edge - Triggered
          - D MS FF
            - Master : D Latch
            - Slave : Clocked S-R Latch
            - Control Input : $C$ & $\overline{C}$
            - Since D Latch has no keeping state when clocked, no 1's catching problem
            - Positive/Negative - level triggered flip-flop : associated with the **output slave**
            - **Direct inputs : often for initial set*
          - T Flip-Flop
            - J-K MS FF with J = K
            - $T = 1$ : Toggle
            - $T = 0$ : Keep
      - **Edge-Triggered D Flip-Flop*

    - Timing parameters

          - Setup Time $t_s$
              - Time before clock edge that data must be stable
              - **For Edge-trigger it's short, for Pulse-trigger it keep for whole pulse*
          - Hold Time $t_h$
            - Time after clock edge that data must be stable
          - Propagation Delay $t_{pd}$
            - Time from input change to output change
          - $t_h$ in $t_{pd}$ and often $t_h < t_{pd}$, thus often ignore $t_h$ in analysis
          - **Clock cycle time > longest propagation delay from one clock edge to another edge**

## Hardware Implementation

- **CMOS*

    - NMOS - GND, PMOS - VCC
    - NMOS & PMOS in series(complesmentary & dual)

- **Register**

  > A set of flip-flops, possibly with added combinational
  > gates, that perform data-processing tasks.
  > The flip-flops hold data, and the gates determine the new or transformed data to be transferred into the flip-flops

  - Structure
      - Clock
          - Sequential control
      - Flip-Flops
          - Storage
      - Data Path (**micro-operation**)
          - Processing data
          - Transfer data
      - Control Unit
          - Control the data path
  
  - Load

    - Parallel Load

      > Load all bits at the same time (clock cycle)
      >

      - Clock gating
        - $C = \overline{Load} + Clock$
        - Clock skew problem, hard to implement
      - Load enable
        - $D = Load \cdot D + \overline{Load} \cdot Q$
        - Actually a MUX
    - Serial Load

      > Load one bit at a time (clock cycle)
      >

      - Useful in data transmission
  
  - Transfer

    > Condition: DR[...] <- SR[Address]
    >

    - Multiplexer and Bus -Based Transfers
      - For single register (too expensive)
        - $Load = K_1 + K_2 + ... +K_n$
        - $D = MUX(Input,K)$
      - For multiple registers
        - Bus : a set of multiplexer outputs shared as a common path (single source problem)
        - Three-state gates : bidirectional input–output lines
  
  - Processing

    - ALU
        - Arithmetic micro-operations
        - Logic micro-operations
    - Shift micro-operations
        - Serial shift
            - Serial link the flip-flops
            - With a proper clock difference, SO can get the serial result
              - For N bits:
                - Starts with N - K clcok cycles, get SI << K
                - Start with N + K clock cycles, get SI >> K
        
        - Parallel shift
            - Parallel output
              - Just add an output for each flip-flop
            - Parallel load
              - Use combinational logic to control the load (MUX)
              - $Shift:Q \leftarrow shift (Q)$
                $\overline{Shift} \cdot Load: Q \leftarrow D$
                $\overline{Shift} \cdot \overline{Load}: Q \leftarrow Q$
        
        - Bidirectional shift
            - Add a control signal to control the direction of shift
            - $\overline{S_1} S_0: D \leftarrow SL(Q)$
              $S_1 \overline{S_0}: D \leftarrow SR(Q)$
              $S_1 S_0: D \leftarrow Input$
              $\overline{S_1} \overline{S_0}: D \leftarrow Q$
  
  - **Counter**

    - Ripple counter
        - $C_{i+1} = \overline{Q_i}(add)/Q_i(dec)$
          $D_i = \overline{Q_i}$
        - Consider every time Q flips, the next flip-flop will be triggered
    
    - Serial counter
        - Same clock
        - Control the D input of each flip-flop, but D relies on the previous flip-flop
    
    - Parallel counter
        - Update all in a single clock cycle
        - More efficient than serial counter
    
    - Other counter
        - Modulo-N counter
        - BCD counter

- **Memory**

  - Some terminology

    - Word
        - A groups of bits that are accessed together
    - Width (Memory width)
        - The number of bits in a word
    - Depth (Address width)
        - The number of words in a memory
    - **Memory size = Width * Depth**
    - Memory data path width
        - The number of bits that can be transferred in a bus
    - Latency time
        - From application of row address until first word available
    - Burst size
        - The number of words/bits transferred in a burst
    - Memory bandwidth
        - Speed of data transfer
        - **Bandwidth = Burst size / (Latency time + Burst Size * Cycle time)**   (Busrt size plus 2 if it's DDR)
  
  - Read / Write

    - CS (Chip Select)
        - Enable the memory
    - Address line
        - Select the word
    - Data line
        - Read / Write the data
    - Access time
        - Time from address to output data
    - Write cycle time
        - Time between successive writes
  
  - Special Technicals

    - bidirectional pins for data line
        - Use three-state gates
    - Coincidence selection
        - 2D array : Access by row address and column address
        - **Often the address line is used for both row select and column select, not row line and column line**
  
  - Extension

    - Word extension
        - Just parallel the data line
    - Depth extension
        - Use a decoder with CS to choose the memory
  
  - SRAM

    > Static Random Access Memory
    >

    - Structure
        - Storage on S-R Latch
        - Dual input & output
    - Volatile
    - Expensive
  
  - DRAM

    > Dynamic Random Access Memory
    >

    - Structure
        - Storage on capacitor
        - Single input & output
    - Cheap
    - Dense
    - Read / Write
        - Row address $\rightarrow$ Column address $\rightarrow$ $\rightarrow$ I/O activated $\rightarrow$ Data valid $\rightarrow$ Refresh
    - Refresh
        - Recharge the capacitor
        - Control by $\overline{RAS}$ & $\overline{CAS}$ of outside devices (0 triggered)
        - Methods
            - RAS-only refresh
                - Refresh the whole row
                - The row address is controlled by IC
                - $RAS =0,CAS =1$
            - CAS-before-RAS refresh
                - Controlled by inner counter
                - $CAS =0 \rightarrow RAS = 0$
            - Hidden refresh
                - CAS-before-RAS refresh following a normal read / write
        - Mode
            - Burst mode
                - stop the work and refresh all memory for a while
            - Distributed refresh
                - Refresh the memory in a distributed way
                - space out refresh one row at a time, thus avoid blocking memory for a long time
    
    - SDRAM

    > Synchronous DRAM
    >

    - Burst length
        - Number of words accessed in a single access (burst read)
  
  - DDR SDRAM

    > Double Data Rate SDRAM
    >

    - Transfer data on both rising and falling edges of the clock
  
  - **RDRAM*

    > Rambus DRAM
    >

## Labs

- 74LS138
    - 3-8 decoder
    - 3 inputs, 8 outputs (negative one-hot logic)
    - 3 enable inputs $G,\overline{G2A},\overline{G2B}$

- MC14495
    - 4 bit Hex - 7 segment decoder
    - negative logic
    - a - f clockwise, g in the middle, p is point

## Verilog

- 门级
    - or,and,not,nand,nor,xor,xnor(output,input1,input2) 

- RTL
    - assign  

- 行为级
    - always @(*) 