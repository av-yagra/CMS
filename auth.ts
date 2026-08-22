import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./lib/mongodb";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "./lib/password";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: MongoDBAdapter(clientPromise),
    session: {
        strategy: "jwt" // Required when using Credentials provider alongside a database adapter
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {},
                password: {}
            },
            async authorize(credentials) {
                // a. Validate that email and password are provided
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                // b. Normalize the email
                const email = String(credentials.email).trim().toLowerCase();
                const password = String(credentials.password);

                // c. Connect to MongoDB using the existing lib/mongodb.ts
                const client = await clientPromise;
                const db = client.db();
                const usersCollection = db.collection("users");

                // d. Search the existing "users" collection using the normalized email
                const user = await usersCollection.findOne({ email });

                // e. If the user does not exist, return null
                if (!user || !user.passwordHash) {
                    return null;
                }

                // f. Use verifyPassword to compare
                const isValid = await verifyPassword(password, user.passwordHash);

                // g. If the password is incorrect, return null
                if (!isValid) {
                    return null;
                }

                // h. Return safe user information (never passwordHash)
                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role // Extracted purely from the database record
                };
            }
        })
    ]
});
