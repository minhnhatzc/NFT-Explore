import axios from "axios";
import { useState, useEffect } from "react";

const NFTView = ({ wallet }) => {
	const [nfts, setNfts] = useState(null);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);

	const resolveIPFS = (url) => {
		if (!url || !url.includes("ipfs://")) return url;
		return url.replace("ipfs://", "https://ipfs.io/ipfs/");
	};

	const getNfts = async () => {
		console.log("Loading");
		setLoading(true);
		try {
			let response = await axios.get(
				`https://eth-mainnet.g.alchemy.com/v2/ZNpEX8yCIuHaWGR4O4IoWfE3Hh-5wKiy/getNFTs?owner=${wallet}&withMetadata=true`
			);
			let data = response.data;
			// Initialize a NFTs array
			let NFTs = [];
			// Destructure the owned NFTs got from the response and add it to NFTs
			NFTs = [...data?.ownedNfts];
			// Get the pageKey
			let pageKey = data?.pageKey;
			let offset = 0;
			while (true) {
				if (offset >= 6) {
					break;
				}
                if(pageKey) {
                    response = await axios.get(
                        `https://eth-mainnet.g.alchemy.com/v2/ZNpEX8yCIuHaWGR4O4IoWfE3Hh-5wKiy/getNFTs?owner=${wallet}&withMetadata=true&pageKey=${pageKey}`
                    );
                    data = response.data;
                    NFTs = [...NFTs, ...data?.ownedNfts];
                    pageKey = data?.pageKey;
                    offset++;
                }
				if (!data.pageKey) {
					break;
				}
			}
			console.log(NFTs);
			setNfts(NFTs);
			setLoading(false);
		} catch (err) {
			console.log(err);
			setError(true);
			setLoading(false);
		}
	};

	useEffect(() => {
		if (wallet?.length === 42) {
			getNfts();
		}
	}, [wallet]);

	return (
		<div>
			{loading ? (
				<div>
					<h1 className="text-4xl font-extrabold">Loading....</h1>
				</div>
			) : error ? (
				<div>
					<h1 className="text-4xl font-extrabold">Something went wrong!</h1>
					<p>Looks like the address you've entered is incorret:(</p>
				</div>
			) : (
				<div className="flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center justify-center py-4">
                        {
                            nfts?.length > 0 && (
                                <img className="w-32 h-32 rounded-full border"
                                src={
                                    nfts[0]?.metadata?.image?.includes("ipfs://")
                                        ? resolveIPFS(nfts[0]?.metadata?.image)
                                        : nfts[0]?.metadata?.image
                                } alt="avatar" />
                            )
                        }
                        <p className="text-lg font-bold">{`${wallet.substring(0,4)}....${wallet.substring(38, 42)}`}</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 mx-auto">
                        {nfts?.length > 0 &&
                            nfts.map((nft, i) => {
                                return (
                                    <div
                                        key={i}
                                        className="flex flex-col justify-center items-center border border-gray-500 mx-2 rounded-lg shadow-md transform hover:scale-105 transition duration-500"
                                    >
                                        <img
                                            src={
                                                nft?.metadata?.image?.includes("ipfs://")
                                                    ? resolveIPFS(nft?.metadata?.image)
                                                    : nft?.metadata?.image
                                            }
                                            alt="nft_image"
                                            onError={({ currentTarget }) => {
                                                currentTarget.onerror = null; // prevents looping
                                                currentTarget.src =
                                                    "https://media3.giphy.com/media/R1cZlHJ7lWLBM80L3z/giphy.gif?cid=790b76118f710e684188cf5ce02a666449a8fd5b6a94f657&rid=giphy.gif&ct=g";
                                            }}
                                        />
                                        <p className="text-base font-bold">{nft?.title}</p>
                                    </div>
                                );
                            })}
                    </div>
                </div>
			)}
		</div>
	);
};

export default NFTView;
