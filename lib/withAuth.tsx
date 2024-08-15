"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Use 'next/navigation' for the App Router
import { supabase } from "@/lib/supabaseClient";

const withAuth = (WrappedComponent: React.FC) => {
	return (props: any) => {
		const router = useRouter();

		useEffect(() => {
			const checkUser = async () => {
				const {
					data: { user },
				} = await supabase.auth.getUser();
				if (!user) {
					router.replace("/login");
				}
			};
			checkUser();
		}, [router]);

		return <WrappedComponent {...props} />;
	};
};

export default withAuth;
