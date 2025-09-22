ntc = (lambda f: (lambda x: f(f, x)))(lambda self, n: chr(n & 0xFF))
rotl = lambda x, n: (((x << (n & 7)) & 0xFF) | (x >> (8 - (n & 7)))) & 0xFF
rotr = lambda x, n: (((x >> (n & 7)) | ((x << (8 - (n & 7))) & 0xFF)) & 0xFF)
H = [4, 6, 6, 6, 6, 2, 2, 5, 6, 7, 6, 6, 2]
L = [8, 5, 12, 12, 15, 12, 0, 7, 15, 2, 12, 4, 1]
pairs = list(map(
    lambda i: (
        (H[i] ^ 0) & 0xF,
        (~(~L[i])) & 0xF
    ),
    range(len(H))
))
to_byte = lambda h, l: rotr(
    rotl((((h & 0xF) << 4) | (l & 0xF)) ^ 0x55, 3) ^ 0xAA,
    3
) ^ 0x00
chw = (
    lambda: ''.join(
        map(
            ntc,
            map(lambda p: to_byte(p[0], p[1]), pairs)
        )
    )
)
print(
    (lambda f: (lambda x: x(x))(lambda y: f(lambda *a, **k: y(y)(*a, **k))))
    (lambda rec: chw())
)
