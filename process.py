fin = open('database.csv','r')
m = dict()
c = 0
s = "let database = [\n"
l = []
for line in fin:
	fields = line.rstrip('\r\n').split(',');
	#fields = map(lambda x:x[1:-1], fields)
	if fields[3] not in m:
		t3 = str(c)
		m[fields[3]] = t3
		c += 1
		l.append(fields[3])
	else:
		t3 = m[fields[3]]

	s += "["+ fields[0][1:-1]+","+fields[1][1:-1]+","+t3+"],\n"

s += "];"
ss = "let dict = ["
for e in l:
	if e[0] != "\"":
		e = "\""+e
	if e[-1] != "\"":
		e = e+"\""
	ss += e+','
ss += '];\n'

print s
print ss
