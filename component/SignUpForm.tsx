"use client"

import { useForm } from "react-hook-form"
import { useSignUp } from "@clerk/nextjs"
import { z } from "zod"

import { signUpSchema } from "@/schemas/signUpSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useRouter } from "next/navigation"



export default function SignUpForm() {
    const router = useRouter()
    const [verifying, setVerifying] = useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)
    const [verificationCode, setVerificationCode] = useState("")
    const [authError, setAuthError] = useState<string | null>(null)
    const [verificationError, setVerificationError] = useState<string | null>(null)
    const { signUp, isLoaded, setActive } = useSignUp()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            password: "",
            passwordConfirmation: "",
        },
    });
    


    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        if (!isLoaded) return;
        setIsSubmiting(true)
        setAuthError(null)
        try {
            await signUp.create({
                emailAddress: data.email,
                password: data.password
            })
            await signUp.prepareEmailAddressVerification({
                strategy: "email_code"
            })
            setVerifying(true)
        } catch (error: any) {
            console.error("signup error: ", error)
            setAuthError(
                error.errors?.[0]?.message || "an error occured during signup"
            )
        } finally {
            setIsSubmiting(false)
        }

     }

    const handleVerificationSubmit = async (e: React.FormEvent<HTMLFormElement>) => { 
        e.preventDefault()
        if (!isLoaded || !signUp) return
        setIsSubmiting(true)
        setAuthError(null)

        try {
            const result = await signUp.attemptEmailAddressVerification({
                code: verificationCode
            })
            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId })
                router.push("/dashbord")
            } else {
                console.error("verification incomplite", result)
                setVerificationError(
                    "verification could not be complite"
                )
            }
        } catch (error: any) {
            console.error("verification incomplite", error)
            setVerificationError(error.errors?.[0]?.message || "an error occured during signup")
        }
        finally {
            setIsSubmiting(false)
        }
    }

    if (verifying) {
        return (
            <h1>this otp entering field</h1>
        )
    }
    return (
        <h1>signup form</h1>
    )
}