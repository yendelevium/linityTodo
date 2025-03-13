"use client"
import AuthForm from "../../../components/AuthForm"
import Link from "next/link"
import useUserStore from "@/store/userStore"
export default function Signup(){
    const {signup} = useUserStore();
    return(
        <>
            <div className="flex flex-col justify-center items-center">
                <h1 className="text-3xl">Signup</h1>
                <AuthForm  handleAuth={signup}/>
                <p>Existing User? <Link href={"/login"}>Login</Link></p>

            </div>
            
        </>
    )
}