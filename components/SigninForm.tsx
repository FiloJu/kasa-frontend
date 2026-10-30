"use client";

import { useState, type FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuthContext } from "@/context/AuthContext";

/** Renders the account registration form and handles its validation. */
export default function SigninForm() {
	const router = useRouter();
	const { register, error: backendError, clearError } = useAuthContext();
	const [submitting, setSubmitting] = useState(false);
	const [localError, setLocalError] = useState<string | null>(null);

	// Clear error on mount
	useEffect(() => {
		clearError();
	}, [clearError]);

	/** Returns a validation message when the password does not meet requirements. */
	function validatePassword(password: string): string | null {
		if (password.length < 8) {
			return "Le mot de passe doit contenir au moins 8 caractères.";
		}
		if (!/[A-Z]/.test(password)) {
			return "Le mot de passe doit contenir au moins une lettre majuscule.";
		}
		if (!/[a-z]/.test(password)) {
			return "Le mot de passe doit contenir au moins une lettre minuscule.";
		}
		if (!/[0-9]/.test(password)) {
			return "Le mot de passe doit contenir au moins un chiffre.";
		}
		if (!/[!@#$%^&*]/.test(password)) {
			return "Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*).";
		}
		return null;
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setLocalError(null);

		const form = event.currentTarget;
		const formData = new FormData(form);
		const lastname = String(formData.get("lastname") ?? "").trim();
		const firstname = String(formData.get("firstname") ?? "").trim();
		const email = String(formData.get("email") ?? "").trim();
		const password = String(formData.get("password") ?? "");
		const passwordError = validatePassword(password);

		if (passwordError) {
			setLocalError(passwordError);
			return;
		}

		setSubmitting(true);

		try {
			await register(`${firstname} ${lastname}`.trim(), email, password);
			router.replace("/");
		} catch (registrationError) {
			if (registrationError instanceof Error) {
				setLocalError(registrationError.message);
			}
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="mt-8 flex w-full max-w-md flex-col gap-5 pb-2"
		>
			{(localError || backendError) && (
				<p className="text-center text-[14px] font-medium text-red-700" role="alert">
					{localError || backendError}
				</p>
			)}

			<div className="flex flex-col items-start">
				<label htmlFor="lastname" className="mb-1 text-[14px] font-medium text-black">
					Nom
				</label>
				<input
					id="lastname"
					name="lastname"
					type="text"
					autoComplete="family-name"
					required
					className="h-10 w-full rounded-[8px] border border-gray-light px-3 text-[14px]"
				/>
			</div>

			<div className="flex flex-col items-start">
				<label htmlFor="firstname" className="mb-1 text-[14px] font-medium text-black">
					Prénom
				</label>
				<input
					id="firstname"
					name="firstname"
					type="text"
					autoComplete="given-name"
					required
					className="h-10 w-full rounded-[8px] border border-gray-light px-3 text-[14px]"
				/>
			</div>

			<div className="flex flex-col items-start">
				<label htmlFor="email" className="mb-1 text-[14px] font-medium text-black">
					Adresse email
				</label>
				<input
					id="email"
					name="email"
					type="email"
					autoComplete="email"
					required
					className="h-10 w-full rounded-[8px] border border-gray-light px-3 text-[14px]"
				/>
			</div>

			<div className="flex flex-col items-start">
				<label htmlFor="password" className="mb-1 text-[14px] font-medium text-black">
					Mot de passe
				</label>
				<input
					id="password"
					name="password"
					type="password"
					autoComplete="new-password"
					minLength={8}
					required
					aria-describedby="password-requirements"
					className="h-10 w-full rounded-[8px] border border-gray-light px-3 text-[14px]"
				/>
				<p id="password-requirements" className="mt-1 text-left text-xs text-gray-dark">
					8 caractères minimum, avec une majuscule, une minuscule, un chiffre et un caractère spécial.
				</p>
			</div>

			<label className="mt-2 flex items-start gap-2 text-left text-[12px] font-normal text-gray-dark">
				<input
					name="terms"
					type="checkbox"
					required
					className="mt-0.5 h-3 w-3 accent-main-red"
				/>
				<span>
					J'accepte les{" "}
					<a
						href="/conditions-generales"
						className="underline underline-offset-2 hover:text-dark-orange"
					>
						conditions générales d'utilisation
					</a>
				</span>
			</label>

			<button
				type="submit"
				disabled={submitting}
				className="mx-auto mt-2 h-9 w-full max-w-57.5 rounded-10 bg-main-red text-[14px] font-medium text-white transition-colors hover:bg-dark-orange disabled:cursor-wait disabled:opacity-50"
			>
				{submitting ? "Inscription en cours…" : "S'inscrire"}
			</button>

			<p className="mx-auto text-[14px] font-normal text-main-red">
				Déjà membre ?{" "}
				<Link href="/login" className="font-medium hover:text-dark-orange">
					Se connecter
				</Link>
			</p>
		</form>
	);
}
