"use client"
import AuthForm from "../../../components/AuthForm"
import Link from "next/link"
import useUserStore from "@/store/userStore"
export default function Login(){
    const {login} = useUserStore();
    return(
        <>
            <div className="flex flex-col justify-center items-center">
                <h1 className="text-3xl">Login</h1>
                <AuthForm handleAuth={login}/>
                <p>New User? <Link href={"/signup"}>Signup</Link></p>
            </div>

        </>
    )
}