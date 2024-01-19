# x86汇编语言基础

## 基本规则

- 寄存器：

  - ax  bx cx dx（计算常用）
  - ds cs(指令和数据段地址)，ss(堆栈地址)，es（段寄存器)
    段寄存器不可以直接赋值常数或计算，只能用寄存器或变量赋值
  - si  di  bx  bp sp (偏移地址寄存器，即可以放进[ ]中)
    （其中ss:sp指向栈顶，bp也常用于栈中元素）
  - ip （指令指针，指令的偏移地址）
  - FL （16位记录运算状态）
- 双目运算**位宽**相等且可确定，并且不能同时为内存地址
  变量强制规定位宽：`byte/word/dword ptr`

  定义的变量某种程度上也属于可确定宽度的，所以可以直接 `mov a,0`
- assume
  本质上为省略段地址的替换

  (同一个段与多个段寄存器有关联时:ds > ss > es > cs)

  例如assume ds:data即将data:自动替换为ds:
  所以一般程序开头有

  ```asm
  mov ax,data
  mov ds,ax
  ```

## 数据存储

- 内存中**小端规则**，低位在前，高位在后

如    1234H  --->      34   12

可用下面两段C语言代码验证

```c

   unsigned short int a = 0x1234;
   unsigned char *p;
   p = (unsigned char *)&a;
   printf("%X %X", p[0], p[1]);


   unsigned char a[2]={0x12, 0x34};
   unsigned short int *p;
   p = (unsigned short int *)a;
   printf("%X", *p);

```

- 符号不区分

```
a db 0FFh
```

到底代表255还是-1,在定义时并不确定

但是在引用变量a时可以用指令来区分它是非符号还是有符号

例如 `imul  a`指令表示乘以  -1 ，而 `mul a`指令则表示乘以 255

- 段地址：偏移地址（逻辑地址寻址）
  以5位16进制的形式
  XXXX:0000~~XXXX:FFFF   64KB
  逻辑地址XXXX0+YYYY
  需要注意一个物理地址可以表示成多个逻辑地址

`12398h=1234:0058=1235:0048=1236:0038=1230:0098`

- 寻址方式

  - 直接寻址（偏移地址为常数，段地址必须为段寄存器）
    1000H:[2000H]❌
  - 间接寻址（偏移地址为寄存器+变量/数组）
- 取地址运算

  - lea & offset

    ```asm
    设abc的偏移地址=1000h
    lea dx, abc         ; lea dx, [1000h]
    mov dx, offset abc  ; mov dx, 1000h

    mov dx, offset ds:[bx+si+3]   ; 语法错误
    lea dx, ds:[bx+si+3]          ; dx=bx+si+3
    mov dx, bx+si+3               ; 错误

    lea eax, [eax+eax*4]          ; EAX=EAX*5 用lea做乘法
    ```
  - lds & les

    取远指针，并分别把段地址赋给ds/es，偏移地址赋给相应目标
- 远近指针

  - **near ptr**(偏移地址)
  - **far ptr**   (段地址:偏移地址)

    假定把一个远指针1234h:5678h存放到地址1000:0000中，则内存布局如下：  &p=1000:0000
    1000:0000 78h
    1000:0001 56h
    1000:0002 34h
    1000:0003 12h

## 算术运算

- `inc / dec  x   `单目运算（自加自减，不影响CF）
- `add / sub  a,b`  双目运算
- `mul x          ` 单目运算
  根据x宽度确定乘法宽度

  ```asm
  mul [1]     ah:al   = al * x
  mul [2]     dx:ax   = ax * x
  mul [4]     edx:eax = eax *x
  ```
- `div x          ` 单目运算

  基本可视为乘法的逆运算，其中dx存余数，ax存商

  （注意dx的清空，否则易出现**divide overflow**报错）

  32位十进制输出

  ```asm
     mov di, 0; 数组s的下标
     mov eax, abc
     mov cx, 0; 统计push的次数
  again:
     mov edx, 0; 被除数为EDX:EAX
     mov ebx, 10
     div ebx; EAX=商, EDX=余数
     add dl, '0'
     push dx
     inc cx; 相当于add cx, 1
     cmp eax, 0
     jne again
  pop_again:
     pop dx
     mov s[di], dl
     inc di
     dec cx; 相当于sub cx, 1
     jnz pop_again
  ```
- ```
   &     |     ^      ~      <<     >>
  and   or    xor    not    shl    shr
  ```

  简单位运算

  （移位运算最后移出的一位存到CF中）
- ```
  rol       ror
  ```

  循环移位

  ```c
  C语言
  rol()  return x<<n | x>>(sizeof(x)*8-n)
  ror()  return x>>n | x<<(sizeof(x)*8-n)
  ```

  用这些指令来完成十六进制输出：

  ```asm
  again:
     rol ax, 4  ;取出最高4位到低位
     push ax
     and ax, 000Fh
     cmp ax, 10
     jb is_digit
  is_alpha:
     sub al, 10
     add al, 'A'
     jmp finish_4bits
  is_digit:
     add al, '0'
  finish_4bits:
     mov s[di], al
     pop ax
     pop cx
     add di, 1
     sub cx, 1
     jnz again
  ```
- sal: shift arithmetic left  算术左移
  sar: shift arithmetic right 算术右移
  sal及sar是针对符号数的移位运算, 对负数右移的时候要在左边补1, 对正数右移的时候左边补0, 无论对正数还是负数左移右边都补0

## 堆栈

- `push x`

  16位或32位，sp=sp-sizeof(x)
- `pop x`

  16位或32位，sp=sp+sizeof(x)
- `pushf & popf` 保护FL状态寄存器
- 手动定义堆栈空间

  ```asm
  stk segment stack
  db 200h dup(0)    ;或写成dw 100h dup(0)
  stk ends
  ```

## FL状态寄存器

CF ZF SF OF AF PF(状态)
DF TF IF（控制）

*mov指令不影响任何标志位*

- CF（Carry Flag）
  加法进位，减法借位

  ```asm
  jc  jnc  (jump if (not)carry flag)
  adc      (add+CF)
  sbb      (sub+CF)
  clc CF=0
  stc CF=1
  ```
- ZF(Zero Flag)
- SF (Sign Flag   1 --> - )
- OF (Overflow Flag)
- PF（Parity Flag）

  奇偶标志，可做校验，低八位中的1的个数，1 --> 有偶数个1
- AF(Auxiliary Flag)

  辅助进位标志，1 --> 第四位与高四位进位或借位时
- DF(Direction Flag)
  字符串复制方向

  ```asm
  cld DF=0 正方向
  std DF=1 反方向
  ```
- IF(Interrupt Flag)
  1 --> 允许中断

  ```asm
  cli   (置0)
  免打扰程序段
  sti  （置1）
  ```
- TF(Trap Flag)
  1 --> 进入单步模式，每条指令后隐含int 1H（callback）
  用于debug，反调试
  被动防御：校验代码防止更改
  主动防御：抢夺资源，自己获得int 1H主动权

## 字符串操作

- **xlat(查表)**

  **al=ds:[bx+al]**
- **movsb movsw movsd(宽度不同)**

  ①ds:si   源字符串(si就是source index)
  ②es:di  目标字符串(di就是destination index)
  ③cx      移动次数
  ④DF=0 即方向标志设成正方向(用指令cld)
- **stosb stosw stosd(宽度不同)**

  mov es:[di],     al/ax/eax

## 关于循环

```asm
loop label    ;while(--CX) jmp label
loopz label   ;while(ZF && --CX) jmp label
loopnz label  ;while(!ZF && --CX) jmp label
```

## 常用中断

```asm
等效操作
pushf, push cs, push ip
tf = 0, if = 0
ip = word ptr 0:[n*4], cs = word ptr 0:[n*4+2]

mov ah,01H
int 21H           ;al=getchar()

mov ah,02H
int 21H           ;putchar(dl)

mov ah,09H
int 21H           ;cout << ds:[dx]-->'$'

mov ah,0AH  
int 21H           ;getline( ds:[dx+2] )
		  ;其中ds:[dx]为最大读入量（记得置一个大数）
		  ;ds:[dx+1] 为实际读到的字符数 

mov ah,4CH
int 21H           ;exit

mov ah,00H
int 16H           ;AH = BIOS scan code
                  ;AL = ASCII character

mov ah,3DH
int 21H           ;openfile

;AL = access and sharing modes
;DS:DX -> ASCIZ filename
;CL = attribute mask of files to look for

;Return:
;CF clear if successful
;AX = file handle
;CF set on error
;AX = error code (01h,02h,03h,04h,05h,0Ch,56h)


```

## 关于BCD码

一种用十六进制表示十进制数的方法，比如端口中时钟

15H   `<---->`   15D

- 压缩BCD    4位表示一个十进制位

  - daa  加法调整
    具体地

  ```cpp
  if((AL & 0FH) >= 0AH) AL += 6H     //低位
  if((AL & 0F0H) >= 0AH) AL += 60H   //高位
  ```
  - das 减法调整类似
- 非压缩BCD     8位表示一个十进制位

  8个二进制位的高四位没用

  0306H  `<---->`  3366H  `<---->` 36D

  - aaa  加法调整
  - 具体地

  ```cpp
  if((AL & 0FH) >= 0AH) AL += 6 , AH++
  ```
  - aas 减法调整类似
  - aam 乘法调整

    ```cpp
    AH /= 10
    AL %= 10
    ```
  - aad 除法 **前** 预先调整

    ```cpp
    AL = (AH * 10 + AL) & 0FFH
    AH = 0
    ```
