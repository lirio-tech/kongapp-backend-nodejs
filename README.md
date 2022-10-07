# Read First
> Backend

### Run Project in your localhost

```sh
npm start
```
Create the file `.env` with all the `enviroment variables`


### Deploy Netlify

> npm install && npm run build

Sem base dir e sem o publish directory

![image](https://user-images.githubusercontent.com/114695511/194653265-b75fbfb7-eadb-4f93-b0a7-ab90abe83e40.png)
   

### API
`Local`: http://localhost:9000/.netlify/functions/api/{YOUR_PATH}   
`Prod`: https://backend-lacasa.netlify.app/.netlify/functions/api/{YOUR_PATH}   

##### Products

`GET All`

```sh
curl --request GET \
  --url http://localhost:9000/.netlify/functions/api/products
```

`POST`

```sh
curl --request POST \
  --url http://localhost:9000/.netlify/functions/api/products \
  --header 'Content-Type: application/json' \
  --data '{
	"description": "Samsung TV 42",
	"code": "0001",
	"price": 1259.00,
	"type": "Unidade"
}'
```

Ref.:   
https://dev.to/mkilmer/how-create-relationships-with-mongoose-and-node-js-with-real-example-43ei
