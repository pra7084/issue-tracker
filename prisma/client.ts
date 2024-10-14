import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();
//In this object we have access to all the models we defined in schema


// techmically we can create this prisma client anywhere in the application but as a best practice we should make sure that there is only single client instance of this running our application.

// we are doing this in this file is because the first time the client file is imported somewhere in our application we get a new instance of prisma client but the 2nd time this code is imported the code will not re-executed, it's cached so the result will be reused

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma
 
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
