import React, { useEffect, useState } from 'react';
import ClientEncryption from '../services/client-encryption';

const EncryptionForm = () => {
    const [address, setAddress] = useState('');
    const [encryptedData, setEncryptedData] = useState<{
        encryptedAddress: string;
        handle: Uint8Array;
    } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Initialize encryption on component mount
        const init = async () => {
            try {
                const encryptor = ClientEncryption.getInstance();
                await encryptor.initialize();
            } catch (err) {
                setError('Failed to initialize encryption');
                console.error(err);
            }
        };
        init();
    }, []);

    const handleEncrypt = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const encryptor = ClientEncryption.getInstance();
            const result = await encryptor.encryptAddress(address);
            setEncryptedData(result);
            
            // Now you can send only the encrypted data to your bot/server
            // The original address never leaves the client
            await submitToBot(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Encryption failed');
        } finally {
            setIsLoading(false);
        }
    };

    const submitToBot = async (encryptedData: { 
        encryptedAddress: string; 
        handle: Uint8Array 
    }) => {
        // Submit only encrypted data to your bot/server
        // Original address is never transmitted
    };

    return (
        <div>
            <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter Ethereum address"
            />
            <button 
                onClick={handleEncrypt}
                disabled={isLoading}
            >
                {isLoading ? 'Encrypting...' : 'Encrypt Address'}
            </button>
            
            {error && <div className="error">{error}</div>}
            
            {encryptedData && (
                <div>
                    <h3>Encrypted Data:</h3>
                    <pre>
                        {JSON.stringify(encryptedData, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default EncryptionForm; 