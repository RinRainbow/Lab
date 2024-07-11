import sys
import json

data_parts = []
chunkSize = 100000

while True:
    input_data = sys.stdin.read(chunkSize)  
    if not input_data:
        break
    data_parts.append(input_data)
full_data = ''.join(data_parts)

try:
    data = json.loads(full_data)
except json.JSONDecodeError as e:
    print(f"Error decoding JSON: {e}", file=sys.stderr)
    sys.exit(1)

# 将数据保存到文件中
output_file = 'output.json'
with open(output_file, 'w') as f:
    json.dump(data, f)

# 返回处理结果
result = {"status": "success", "processed_data": "ok"}
print(json.dumps(result))
