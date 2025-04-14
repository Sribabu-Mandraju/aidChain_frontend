"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { formatAddress } from "../../../utils/dao_helper"
import { getReadDaoContract, getWriteDaoContract } from '../../../providers/dao_provider'
import { Toaster, toast } from "react-hot-toast"
import { useAccount } from 'wagmi'

const MemberManagement = ({ onClose }) => {
  const [newMemberAddress, setNewMemberAddress] = useState("")
  const [addressError, setAddressError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [members, setMembers] = useState([])
  const [filteredMembers, setFilteredMembers] = useState([])
  const [selectedMember, setSelectedMember] = useState(null)
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { address: connectedAddress, isConnected } = useAccount()

  useEffect(() => {
    if (isConnected) {
      fetchMembers()
    }
  }, [isConnected])

  useEffect(() => {
    setFilteredMembers(
      members.filter((member) => member.address.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [searchTerm, members])

  const fetchMembers = async () => {
    toast.loading('Fetching members...', { id: 'fetch-members' })
    setIsLoading(true)
    setMembers([]) // Clear previous members while fetching

    try {
      const contract = getReadDaoContract()
      if (!contract || !contract.publicClient) {
        throw new Error("DAO contract or public client not available")
      }

      console.log("Attempting to call getDAOMembers...")
      const memberAddressesResult = await contract.publicClient.readContract({
        ...contract,
        functionName: 'getDAOMembers',
      })

      // Log the raw result from the contract call
      console.log("Raw result from getDAOMembers:", memberAddressesResult)

      // Ensure the result is an array before proceeding
      if (!Array.isArray(memberAddressesResult)) {
         // Check if it's null/undefined vs. some other non-array type
         if (memberAddressesResult == null) {
             console.log("getDAOMembers returned null or undefined. Assuming no members.")
             setMembers([]) // Set to empty array if null/undefined
         } else {
             // Throw an error if it's some other unexpected type
             throw new Error(`Invalid data type received from getDAOMembers: expected array, got ${typeof memberAddressesResult}`)
         }
      } else {
          // If it's an array, proceed with formatting
          const formattedMembers = memberAddressesResult.map(address => ({
            address: address,
            joinedAt: new Date().toISOString() // Placeholder join date
          }))
          setMembers(formattedMembers)
          console.log("Formatted members:", formattedMembers)
      }

      toast.success('Members fetched successfully!', { id: 'fetch-members' })

    } catch (error) {
       // Log the *entire* error object for detailed debugging
       console.error("Detailed error fetching members:", error)

       // Display a user-friendly message
       const errorMessage = error?.shortMessage || (error instanceof Error ? error.message : 'An unknown error occurred')
       toast.error(`Failed to fetch members: ${errorMessage}`, { id: 'fetch-members' })
       setMembers([]) // Ensure members are cleared on error
    } finally {
       setIsLoading(false)
    }
  }

  const validateAddress = (address) => {
    const addressRegex = /^0x[a-fA-F0-9]{40}$/
    return addressRegex.test(address)
  }

  const handleAddMember = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!newMemberAddress) {
      setAddressError("Address is required")
      return
    }

    if (!validateAddress(newMemberAddress)) {
      setAddressError("Invalid Ethereum address format")
      return
    }

    if (members.some((member) => member.address.toLowerCase() === newMemberAddress.toLowerCase())) {
      setAddressError("This address is already a member")
      return
    }

    setIsLoading(true)
    const toastId = toast.loading('Adding member...')
    try {
      const contract = await getWriteDaoContract()
       if (!contract || !contract.publicClient || !contract.walletClient) {
          throw new Error("DAO contract, public client, or wallet client not available")
       }

      const isAdmin = await contract.publicClient.readContract({
        ...contract,
        functionName: 'isAdmin',
        args: [connectedAddress],
      })

      if (!isAdmin) {
        toast.error('Only admins can add members', { id: toastId })
        setIsLoading(false)
        return
      }

      const hash = await contract.walletClient.writeContract({
        ...contract,
        functionName: 'addDAOMember',
        args: [newMemberAddress],
        account: connectedAddress,
      })

      toast.loading('Waiting for transaction confirmation...', { id: toastId })

      const receipt = await contract.publicClient.waitForTransactionReceipt({ hash })

      if (receipt.status === 'success') {
        toast.success(
          <div>
            Member added successfully!
            <a
              href={`https://sepolia.basescan.org/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline ml-1"
            >
              View Tx
            </a>
          </div>,
          { id: toastId, duration: 5000 }
        )
        await fetchMembers()
        setNewMemberAddress("")
        setAddressError("")
      } else {
         toast.error(`Transaction failed. Status: ${receipt.status}`, { id: toastId })
      }
    } catch (error) {
      console.error("Error adding member:", error)
       const errorMessage = error?.shortMessage || error?.message || 'An unknown error occurred'
       toast.error(`Failed to add member: ${errorMessage}`, { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveMember = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!selectedMember) return

    setIsLoading(true)
    const toastId = toast.loading('Removing member...')
    try {
      const contract = await getWriteDaoContract()
       if (!contract || !contract.publicClient || !contract.walletClient) {
          throw new Error("DAO contract, public client, or wallet client not available")
       }

      const isAdmin = await contract.publicClient.readContract({
        ...contract,
        functionName: 'isAdmin',
        args: [connectedAddress],
      })

      if (!isAdmin) {
        toast.error('Only admins can remove members', { id: toastId })
        setIsLoading(false)
        return
      }

      const hash = await contract.walletClient.writeContract({
        ...contract,
        functionName: 'removeDAOMember',
        args: [selectedMember.address],
        account: connectedAddress,
      })

      toast.loading('Waiting for transaction confirmation...', { id: toastId })

      const receipt = await contract.publicClient.waitForTransactionReceipt({ hash })

      if (receipt.status === 'success') {
        toast.success(
          <div>
            Member removed successfully!
            <a
              href={`https://sepolia.basescan.org/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline ml-1"
            >
              View Tx
            </a>
          </div>,
          { id: toastId, duration: 5000 }
        )
         await fetchMembers()
        setIsRemoveModalOpen(false)
        setSelectedMember(null)
      } else {
        toast.error(`Transaction failed. Status: ${receipt.status}`, { id: toastId })
      }
    } catch (error) {
      console.error("Error removing member:", error)
       const errorMessage = error?.shortMessage || error?.message || 'An unknown error occurred'
       toast.error(`Failed to remove member: ${errorMessage}`, { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative bg-white/80 backdrop-blur-sm rounded-xl shadow-md overflow-hidden max-w-2xl mx-auto my-8">

      {isLoading && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      )}

      <div className="bg-gradient-to-r from-green-500 to-emerald-600 py-4 px-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-white">DAO Member Management</h3>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h4 className="text-lg font-semibold mb-3">Add New Member</h4>
          <div className="flex flex-col sm:flex-row gap-3 items-start">
            <div className="flex-1 w-full sm:w-auto">
              <input
                type="text"
                value={newMemberAddress}
                onChange={(e) => {
                  setNewMemberAddress(e.target.value)
                  setAddressError("")
                }}
                placeholder="Enter wallet address (0x...)"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  addressError ? "border-red-500 ring-red-500" : "border-gray-300"
                }`}
                disabled={isLoading || !isConnected}
                aria-invalid={!!addressError}
                aria-describedby={addressError ? "address-error" : undefined}
              />
              {addressError && <p id="address-error" className="mt-1 text-sm text-red-600">{addressError}</p>}
            </div>
            <button
              onClick={handleAddMember}
              className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              disabled={isLoading || !isConnected || !newMemberAddress || !!addressError}
            >
              Add Member
            </button>
          </div>
          {!isConnected && (
            <p className="mt-2 text-sm text-yellow-600">Please connect your wallet to manage members.</p>
          )}
        </div>

        <div>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
            <h4 className="text-lg font-semibold">Current Members ({members.length})</h4>
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search members..."
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isLoading || !members.length}
              />
            </div>
          </div>

          <div className="bg-white/50 rounded-lg overflow-hidden border border-gray-200 min-h-[200px] max-h-[400px] overflow-y-auto">
            {isLoading && members.length === 0 ? (
               <div className="py-8 text-center text-gray-500">Loading members...</div>
            ) : !isLoading && members.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                No members have been added to this DAO yet.
              </div>
            ) : filteredMembers.length === 0 && searchTerm ? (
               <div className="py-8 text-center text-gray-500">
                  No members found matching "{searchTerm}".
               </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredMembers.map((member) => (
                  <motion.li
                    key={member.address}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex justify-between items-center py-3 px-4 hover:bg-green-50 transition-colors"
                  >
                    <div className="truncate mr-4">
                      <p className="font-medium truncate" title={member.address}>{formatAddress(member.address)}</p>
                      <p className="text-sm text-gray-500">Joined: {new Date(member.joinedAt).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedMember(member)
                        setIsRemoveModalOpen(true)
                      }}
                      className="text-red-600 hover:text-red-800 transition-colors p-1 rounded-full hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading || !isConnected}
                      title="Remove Member"
                    >
                       <span className="sr-only">Remove Member {formatAddress(member.address)}</span>
                       <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                    </button>
                  </motion.li>
                ))}
              </ul>
            )}
             {isLoading && members.length === 0 && (
               <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Remove Member Confirmation Modal */}
      <AnimatePresence>
        {isRemoveModalOpen && selectedMember && (
          // Using a Portal might be better here if z-index issues persist,
          // but keeping it simple for now. Requires importing 'react-dom'.
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4"> {/* Adjusted centering and padding */}
            {/* Backdrop */}
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.2 }}
               className="fixed inset-0 bg-black/50" // Darker backdrop
               aria-hidden="true"
               onClick={() => !isLoading && setIsRemoveModalOpen(false)} // Close on click outside if not loading
            ></motion.div>

            {/* Modal Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full" // Responsive width
              role="dialog" // Add role
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 id="modal-title" className="text-lg leading-6 font-medium text-gray-900">Remove DAO Member</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to remove this member from the DAO? This action cannot be undone.
                      </p>
                      <p className="mt-2 font-medium break-all">{/* Allow address to break */}
                        {selectedMember.address}
                      </p>
                       <p className="mt-1 font-medium">({formatAddress(selectedMember.address)})</p> {/* Show formatted too */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2"> {/* Added gap */}
                <button
                  type="button"
                  onClick={handleRemoveMember}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed" // Added focus ring styles
                  disabled={isLoading || !isConnected}
                >
                   {isLoading ? 'Removing...' : 'Remove'} {/* Dynamic button text */}
                </button>
                <button
                  type="button"
                  onClick={() => setIsRemoveModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50" // Added focus ring styles
                  disabled={isLoading} // Disable cancel if loading
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MemberManagement