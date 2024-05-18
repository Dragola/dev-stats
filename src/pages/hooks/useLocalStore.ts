import { Dispatch, SetStateAction, useEffect, useState } from "react"

export default function useLocalStore<T>(value: T, name: string) {
	const [local, setLocal] = useState<T>(value)

	useEffect(() => {
		const oldStringValue = localStorage.getItem(name)
		
		if (oldStringValue) {
			try {
				const oldValue = JSON.parse(oldStringValue) as T
				
				setLocal(oldValue)
			} catch (err) {
				console.error(err)
			}
		}
		
	}, [name])

	return [local, (value: T) => {
		setLocal(value)
		localStorage.setItem(name, JSON.stringify(value));	
	}] as [T, Dispatch<SetStateAction<T>>];
}
