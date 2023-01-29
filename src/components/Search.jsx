import { useState } from "react"
import NFTView from "./NFTView";
import App from "../App";
const Search = () => {
	const [inputField, setInputField] = useState("null")
	const [wallet, setWallet] = useState(null);


    const submitHandler = (e) => {
        e.preventDefault();
        if (inputField.length === 42) {
            console.log(inputField);
            setWallet(inputField)
        } else {
            console.log("Enter a valid wallet address");
        }
    };



	const connectWallet = async () => {
		try {
			const { ethereum } = window;
			if (!ethereum) {
				alert("Get Metamask!");
				return;
			} else {
				const accounts = await ethereum.request({
					method: "eth_requestAccounts",
				});

				console.log("Connected ", accounts[0]);
				setWallet(accounts[0]);
			}
		} catch (error) {
			console.log(error);
		}
	};

		return (
				<div className="flex flex-col justify-center items-center">
					{/* Search Input and Button */}
					<form
						onSubmit={(e) => submitHandler(e)}
						className="flex justify-center items-center gap-4 pt-0 min-w-[600px]"
					>
						{/* Search Input */}
						<input
							type="text"
							placeholder="Enter a wallet address"
							onChange={(e) => inputField(e.target.value)}
							className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"
						/>
						<button
							type="submit"
							className="px-3 py-3 bg-green-300 text-black font-bold rounded transform hover:scale-105"
						>
							Search
						</button>
					</form>

                    <p className="py-2">-------or-------</p>
			<button
				onClick={connectWallet}
				className="px-3 py-3 bg-blue-400 text-black font-bold rounded transform hover:scale-105"
			>
				Connect Wallet
			</button>


				</div>
			);
		};

        export default Search;
