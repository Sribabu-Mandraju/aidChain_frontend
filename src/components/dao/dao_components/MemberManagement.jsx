"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { formatAddress } from "../../../utils/dao_helper"

const MemberManagement = ({ onClose, currentMembers, onAddMember, onRemoveMember }) => {
  const [newMemberAddress, setNewMemberAddress] = useState("")
  const [addressError, setAddressError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredMembers, setFilteredMembers] = useState([])
  const [selectedMember, setSelectedMember] = useState(null)
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)

  useEffect(() => {
    setFilteredMembers(
      currentMembers.filter((member) => member.address.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [searchTerm, currentMembers])

  const validateAddress = (address) => {
    // Basic Ethereum address validation
    const addressRegex = /^0x[a-fA-F0-9]{40}$/
    return addressRegex.test(address)
  }

  const handleAddMember = () => {
    if (!newMemberAddress) {
      setAddressError("Address is required")
      return
    }

    if (!validateAddress(newMemberAddress)) {
      setAddressError("Invalid Ethereum address format")
      return
    }

    // Check if address already exists
    if (currentMembers.some((member) => member.address.toLowerCase() === newMemberAddress.toLowerCase())) {
      setAddressError("This address is already a member")
      return
    }

    onAddMember(newMemberAddress)
    setNewMemberAddress("")
    setAddressError("")
  }

  const openRemoveModal = (member) => {
    setSelectedMember(member)
    setIsRemoveModalOpen(true)
  }

  const handleRemoveMember = () => {
    if (selectedMember) {
      onRemoveMember(selectedMember.address)
      setIsRemoveModalOpen(false)
      setSelectedMember(null)
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md overflow-hidden">
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

      <div className="p-6">
        {/* Add New Member */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-4">Add New Member</h4>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={newMemberAddress}
                onChange={(e) => {
                  setNewMemberAddress(e.target.value)
                  setAddressError("")
                }}
                placeholder="Enter wallet address (0x...)"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  addressError ? "border-red-500" : "border-gray-300"
                }`}
              />
              {addressError && <p className="mt-1 text-sm text-red-600">{addressError}</p>}
            </div>
            <button
              onClick={handleAddMember}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-colors"
            >
              Add Member
            </button>
          </div>
        </div>

        {/* Member List */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold">Current Members</h4>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search members..."
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="bg-white/50 rounded-lg overflow-hidden">
            {filteredMembers.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {filteredMembers.map((member, index) => (
                  <motion.li
                    key={member.address}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex justify-between items-center py-3 px-4 hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium">{formatAddress(member.address)}</p>
                      <p className="text-sm text-gray-500">Joined: {new Date(member.joinedAt).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => openRemoveModal(member)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
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
            ) : (
              <div className="py-8 text-center text-gray-500">
                {searchTerm ? "No members found matching your search" : "No members added yet"}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Remove Member Confirmation Modal */}
      <AnimatePresence>
        {isRemoveModalOpen && selectedMember && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div
                  className="absolute inset-0 "
                  onClick={() => setIsRemoveModalOpen(false)}
                ></div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              >
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Remove DAO Member</h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to remove this member from the DAO? This action cannot be undone.
                        </p>
                        <p className="mt-2 font-medium">{formatAddress(selectedMember.address)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleRemoveMember}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Remove
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRemoveModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MemberManagement
