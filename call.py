import asyncio
import requests

async def main():
    asd = requests.post('https://10.94.1.x/bcisco.csc', data={ "5356": 90 }, verify=False)

    print(asd)

asyncio.run(main())