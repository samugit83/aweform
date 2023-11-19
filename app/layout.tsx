import "@/styles/globals.css";
import { Metadata } from "next";
import { Providers } from "./providers"
import { ReduxProvider } from '@/redux/redux_useclient_export.js'
import { Poppins } from 'next/font/google'

const poppins = Poppins(
	{weight: '400',
	 subsets: ['latin']}
)


export const metadata: Metadata = {
	title: {
		default: 'Supercar',
		template: 'Supercar'
	},
	description: 'this is a supercar form',
	icons: {
		icon: "/favicon.ico",
	}
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body>
				<ReduxProvider>
					<Providers>
						<main className={`${poppins.className} w-screen h-screen fixed`}>
							<div className="h-full flex-1 overflow-y-auto">
                               {children}
							</div>
						</main>
					</Providers>
				</ReduxProvider>
			</body>
		</html>
	);
}
