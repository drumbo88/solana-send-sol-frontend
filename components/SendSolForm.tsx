import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as Web3 from '@solana/web3.js'
import { FC, useState } from 'react'
import styles from '../styles/Home.module.css'

export const SendSolForm: FC = () => {

	const { connection } = useConnection();
	const { publicKey: myPublicKey, sendTransaction } = useWallet();

    const [amount, setAmount] = useState(0)
    const [toAddress, setToAddress] = useState('')
console.log('MAIN',{amount, toAddress})
    const sendSol = event => {
        event.preventDefault()
        console.log('sendSol',{amount, toAddress})

		if (!connection || !myPublicKey) {
			alert("Please connect your wallet first lol")
			return
		}

        let toPublicKey
        try {
            toPublicKey = new Web3.PublicKey(toAddress)
        }
        catch {
            alert('The destination address is invalid.')
            return
        }

		const transaction = new Web3.Transaction()

        const transferInstruction = Web3.SystemProgram.transfer({
            fromPubkey: myPublicKey,
            toPubkey: toPublicKey,
            lamports: amount * Web3.LAMPORTS_PER_SOL,
        })

        transaction.add(transferInstruction)

        sendTransaction(transaction, connection).then(sig => {
			console.log(`Explorer URL: https://explorer.solana.com/tx/${sig}?cluster=devnet`)
		})

        console.log(`Send ${amount} SOL to ${toPublicKey}`)
    }

    return (
        <div>
            <form onSubmit={sendSol} className={styles.form}>
                <label htmlFor="amount">Amount (in SOL) to send:</label>
                <input id="amount" type="text" onChange={event=>setAmount(parseFloat(event.target.value))} className={styles.formField} placeholder="e.g. 0.1" required />
                <br />
                <label htmlFor="recipient">Send SOL to:</label>
                <input id="recipient" type="text" onChange={event=>setToAddress(event.target.value)} className={styles.formField} placeholder="e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA" required />

                <button type="submit" className={styles.formButton}>Send</button>
            </form>
        </div>
    )
}