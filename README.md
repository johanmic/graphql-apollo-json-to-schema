# graphql-apollo-json-to-schema
recursively converts a JSON object to an Apollo Schema
read more about schemas [here](http://dev.apollodata.com/tools/graphql-tools/generate-schema.html)

can be used directly with output from MongoDB

usage:

```javascript
paramters: name (String)
JSON: Json Object,
skip: array *Optional


converter(name, JSON, skip(array) )

```

example:

```javascript

const converter = require('graphql-apollo-json-to-schema')

const input = {
  name:'Dr Steve Brule',
  profession:'Doctor',
  quotes: ['Bringo!','Jackprot!'],
  age:27,
  password:'nohunks',
  apperances: {
    checkItOut: {
      type:'tv show',
      rating:'11/10',
      date: new Date()
    },

  }
}

console.log(converter('User',input,['password']))
//`
// OutOput:
// type User {
//   name: String
//   profession: String
//   quotes: [String]
//   age: Int
//    apperances: UserApperances
//  }
// 
//  type UserApperances {
//    checkItOut: UserApperancesCheckitout
//  }
// 
//  type UserApperancesCheckitout {
//   type: String
//   rating: String
//   date: String
//  }
// `

```

**Note on Arrays containing Objects:**
The first item in an array will be picked and used, if subsequent items contains other items they will be lost.

