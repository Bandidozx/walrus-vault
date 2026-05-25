module walrus_vault::vault {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::String;

    /// Represents a file stored in Walrus Vault
    public struct FileVault has key, store {
        id: UID,
        owner: address,
        walrus_blob_id: String,
        file_name: String,
        file_size: u64,
        created_at: u64,
        access_nft_id: ID,
    }

    /// NFT that grants access to a file
    public struct AccessNFT has key, store {
        id: UID,
        owner: address,
        vault_id: ID,
        file_name: String,
        created_at: u64,
    }

    /// Event emitted when file is uploaded
    public struct FileUploaded has copy, drop {
        vault_id: ID,
        owner: address,
        file_name: String,
        walrus_blob_id: String,
    }

    /// Event emitted when file is accessed
    public struct FileAccessed has copy, drop {
        vault_id: ID,
        accessor: address,
        accessed_at: u64,
    }

    /// Upload a file to Walrus and create vault entry
    public fun upload_file(
        walrus_blob_id: String,
        file_name: String,
        file_size: u64,
        ctx: &mut TxContext,
    ): (FileVault, AccessNFT) {
        let sender = tx_context::sender(ctx);
        let vault_uid = object::new(ctx);
        let vault_id = object::uid_to_inner(&vault_uid);
        
        let nft_uid = object::new(ctx);
        let nft_id = object::uid_to_inner(&nft_uid);

        let vault = FileVault {
            id: vault_uid,
            owner: sender,
            walrus_blob_id: walrus_blob_id,
            file_name: file_name,
            file_size: file_size,
            created_at: tx_context::epoch(ctx),
            access_nft_id: nft_id,
        };

        let nft = AccessNFT {
            id: nft_uid,
            owner: sender,
            vault_id: vault_id,
            file_name: file_name,
            created_at: tx_context::epoch(ctx),
        };

        (vault, nft)
    }

    /// Transfer access NFT to another user
    public fun transfer_access(
        nft: AccessNFT,
        recipient: address,
    ) {
        transfer::transfer(nft, recipient);
    }

    /// Check if user has access to file
    public fun has_access(
        nft: &AccessNFT,
        user: address,
    ): bool {
        nft.owner == user
    }

    /// Get file metadata
    public fun get_file_info(vault: &FileVault): (String, u64, address) {
        (vault.file_name, vault.file_size, vault.owner)
    }
}
