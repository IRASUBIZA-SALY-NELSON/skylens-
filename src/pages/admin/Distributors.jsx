import React, { useState, useEffect } from 'react'
import { Search, Filter, Plus, Eye, Trash2, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, ChevronDown, Users, HandCoins, ChartColumn, PlusCircle, LayoutDashboard } from 'lucide-react'
import FilterModal from '../../components/modals/FilterModal'
import AddDistributorModal from '../../components/modals/AddDistributorModal'
import DeleteDistributorModal from '../../components/modals/DeleteDistributorModal'
import { Listbox } from '@headlessui/react'

const Distributors = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedDistributor, setSelectedDistributor] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [filteredData, setFilteredData] = useState([])

  const statsCards = [
    {
      title: 'Today Distributors',
      value: '470',
      change: '+8%',
      changeType: 'increase',
      period: 'Today, July 14, 2023',
      icon: Users,
      iconBg: 'bg-[rgba(113,82,243,0.05)]',
      iconColor: 'text-[#7152F3]'
    },
    {
      title: 'Total Distributor Contribution',
      value: '5,000,000rwf',
      change: '+12%',
      changeType: 'increase',
      period: 'Today, July 16, 2023',
      icon: HandCoins,
      iconBg: 'bg-[rgba(113,82,243,0.05)]',
      iconColor: 'text-[#7152F3]'
    },
    {
      title: 'Average Revenue Per Account',
      value: '560,000rwf',
      change: '+19%',
      changeType: 'increase',
      period: 'Today, July 19, 2023',
      icon: ChartColumn,
      iconBg: 'bg-[rgba(113,82,243,0.05)]',
      iconColor: 'text-[#7152F3]'
    }
  ]

  const timeRanges = [
    { id: 1, name: 'Today' },
    { id: 2, name: 'Yesterday' },
    { id: 3, name: 'This Week' },
    { id: 4, name: 'This Month' },
  ]

  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRanges[0])

  const distributors = [
    { id: 1, companyName: 'AMACO CLOTHES LTD', manager: 'Leasie Watson', managerAvatar: 'LW', lastOrder: '10/12/2025', revenue: '100,000rwf' },
    { id: 2, companyName: 'FASHION WORLD LTD', manager: 'John Smith', managerAvatar: 'JS', lastOrder: '08/11/2025', revenue: '85,000rwf' },
    { id: 3, companyName: 'STYLE BOUTIQUE', manager: 'Sarah Johnson', managerAvatar: 'SJ', lastOrder: '15/12/2025', revenue: '120,000rwf' },
    { id: 4, companyName: 'TRENDY WEAR LTD', manager: 'Mike Wilson', managerAvatar: 'MW', lastOrder: '05/12/2025', revenue: '95,000rwf' },
    { id: 5, companyName: 'ELITE FASHION', manager: 'Emily Davis', managerAvatar: 'ED', lastOrder: '12/12/2025', revenue: '110,000rwf' },
    { id: 6, companyName: 'MODERN STYLES', manager: 'David Brown', managerAvatar: 'DB', lastOrder: '18/11/2025', revenue: '75,000rwf' },
    { id: 7, companyName: 'LUXURY BRANDS', manager: 'Lisa Anderson', managerAvatar: 'LA', lastOrder: '20/12/2025', revenue: '150,000rwf' },
  ]

  // Filter data based on search term
  useEffect(() => {
    const filtered = distributors.filter(distributor => 
      distributor.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      distributor.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
      distributor.lastOrder.includes(searchTerm) ||
      distributor.revenue.includes(searchTerm)
    )
    setFilteredData(filtered)
    setCurrentPage(1) // Reset to first page when search changes
  }, [searchTerm])

  // Initialize filteredData with all data on first render
  useEffect(() => {
    setFilteredData(distributors)
  }, [])

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1)
    }
  }

  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1)
    }
  }

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value))
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  // Generate page numbers
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPageNumbers = 4 // Maximum number of page numbers to show
    const halfMax = Math.floor(maxPageNumbers / 2)
    
    if (totalPages <= maxPageNumbers) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
      return pageNumbers
    }
    
    if (currentPage <= halfMax) {
      for (let i = 1; i <= maxPageNumbers; i++) {
        pageNumbers.push(i)
      }
      pageNumbers.push('...')
      pageNumbers.push(totalPages)
      return pageNumbers
    }
    
    if (currentPage >= totalPages - halfMax) {
      pageNumbers.push(1)
      pageNumbers.push('...')
      for (let i = totalPages - maxPageNumbers + 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
      return pageNumbers
    }
    
    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages
    ]
  }

  const handleFilter = () => {
    setShowFilterModal(true)
  }

  const applyFilter = (filterData) => {
    console.log('Applying filter:', filterData)
    setShowFilterModal(false)
  }

  const handleAddDistributor = () => {
    setShowAddModal(true)
  }

  const handleDeleteDistributor = (distributor) => {
    setSelectedDistributor(distributor)
    setShowDeleteModal(true)
  }

  const confirmDeleteDistributor = () => {
    console.log('Deleting distributor:', selectedDistributor)
    setShowDeleteModal(false)
    setSelectedDistributor(null)
  }

  const handleViewDashboard = (distributor) => {
    console.log('Viewing dashboard for:', distributor)
    // Navigate to distributor dashboard
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
 

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[10px] mb-8">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-[10px]">
                <div className={`${stat.iconBg} rounded-[8px] h-[40px] w-[40px] flex items-center justify-center`}>
                {stat.icon && (
                      <div className="bg-[rgba(113,82,243,0.05)] rounded-[8px] h-[40px] w-[40px] flex items-center justify-center">
                      <stat.icon className="h-5 w-5 text-[#7152F3]" />
                        </div>
                    )}                </div>
                <span className="text-[16px] font-medium text-[#16151C]">
                  {stat.title}
                </span>
              </div>
              <Listbox value={selectedTimeRange} onChange={setSelectedTimeRange}>
                {({ open }) => (
                  <div className="relative">
                    <Listbox.Button className="flex items-center space-x-[10px] border border-[rgba(162,161,168,0.2)] h-[40px] px-3 rounded-[10px] transition-colors hover:border-[#7152F3] focus:outline-none focus:ring-2 focus:ring-[#7152F3] focus:border-transparent">
                      <span className="text-[16px] text-[#16151C]">{selectedTimeRange.name}</span>
                      <ChevronDown 
                        className={`h-[15px] w-[15px] text-[#16151C] transition-transform ${open ? 'transform rotate-180' : ''}`} 
                        aria-hidden="true"
                      />
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-10 w-[170px] mt-1 bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {timeRanges.map((range) => (
                        <Listbox.Option
                          key={range.id}
                          value={range}
                          className={({ active }) =>
                            `${active ? 'bg-purple-100 text-[#7152F3]' : 'text-gray-900'}
                             cursor-pointer select-none relative py-2 pl-3 pr-9`
                          }
                        >
                          {({ selected }) => (
                            <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                              {range.name}
                            </span>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                )}
              </Listbox>
            </div>
            <div className="flex w-full justify-between items-baseline space-x-2">
              <span className="text-[30px] font-bold text-gray-900">
                {stat.value}
              </span>
              <div
                className={`flex items-center text-[11px] p-[5px] ${
                  stat.changeType === "increase"
                    ? "text-green-600 bg-green-100 rounded-[8px]"
                    : "text-red-600 bg-red-100 rounded-[8px]"
                }`}
              >
                {stat.changeType === "increase" ? (
                  <TrendingUp className="h-[17px] w-[17px] mr-1" />
                ) : (
                  <TrendingDown className="h-[17px] w-[17px] mr-1" />
                )}
                {stat.change}
              </div>
            </div>
            <p className="text-xs text-gray-500 border-t-[1px] border-gray-200 pt-[10px] mt-2">{stat.period}</p>
          </div>
        ))}
      </div>

      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-3 sm:space-y-0">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#A2A1A8]" />
          <input
            type="text"
            placeholder="Search distributors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 h-[50px] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7152F3] focus:border-[#7152F3]"
          />
        </div>
        
        <div className="flex items-center space-x-3 w-full sm:w-auto">
        <button 
            className="flex items-center space-x-2 h-[50px] justify-center px-4 py-2 bg-[#7152F3] text-white rounded-lg hover:bg-[#5E43D8] transition-colors w-full sm:w-auto"
            onClick={handleAddDistributor}
          >
              <PlusCircle className="h-[24px] w-[24px]" />
            <span>Add New Distributor</span>
          </button>
          <button 
            className="flex items-center space-x-2 h-[50px] justify-center px-4 py-2 border border-gray-300 text-[#16151C] rounded-lg hover:bg-gray-50 transition-colors w-full sm:w-auto"
            onClick={handleFilter}
          >
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
          
      
        </div>
      </div>

      {/* Distributors Table */}
      <div className="bg-white rounded-lg w-full border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-[16px] font-medium text-[#A2A1A8] tracking-wider">
                  Distributor Name
                </th>
                <th className="px-6 py-3 text-left text-[16px] font-medium text-[#A2A1A8] tracking-wider">
                  Account Manager
                </th>
                <th className="px-6 py-3 text-left text-[16px] font-medium text-[#A2A1A8] tracking-wider">
                  Last Order Date
                </th>
                <th className="px-6 py-3 text-left text-[16px] font-medium text-[#A2A1A8] tracking-wider">
                  Total YTD Revenue
                </th>
                <th className="px-6 py-3 text-left text-[16px] font-medium text-[#A2A1A8] tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((distributor) => (
                  <tr key={distributor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-[16px] text-[#16151C]">
                      {distributor.companyName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-[#7152F3] rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">{distributor.managerAvatar}</span>
                        </div>
                        <span className="text-[16px] text-[#16151C]">{distributor.manager}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[16px] text-[#16151C]">
                      {distributor.lastOrder}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[16px] text-[#16151C] font-medium">
                      {distributor.revenue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button 
                          className="flex flex-row w-fit gap-[10px] bg-[#7152F3] text-white text-[16px] p-[14px] py-[8px] items-center justify-center rounded-[8px] hover:bg-purple-700 transition-colors"
                          onClick={() => handleViewDashboard(distributor)}
                        >
                         
                          <span>View Dashboard</span>
                          <LayoutDashboard className="w-[20px] h-[20px]" />
                        </button>
                        <button 
                          className="flex flex-row w-fit gap-[10px] bg-[#7152F3] text-white text-[16px] p-[14px] py-[8px] items-center justify-center rounded-[8px] hover:bg-purple-700 transition-colors"
                          onClick={() => handleDeleteDistributor(distributor)}
                        >
                          <Trash2 className="w-[20px] h-[20px]" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-[#A2A1A8]">
                    No distributors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-6 py-3 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-[#A2A1A8]">Show</span>
              <select 
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="border border-gray-300 rounded px-2 py-1 text-sm text-[#16151C]"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-[#A2A1A8]">
                Showing {filteredData.length > 0 ? indexOfFirstItem + 1 : 0} to{' '}
                {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} records
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <button 
                className={`px-3 py-1 text-sm ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-[#A2A1A8] hover:text-[#7152F3]'}`}
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              
              {getPageNumbers().map((number, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 text-sm rounded ${
                    number === currentPage
                      ? 'border-[#7152F3] border-[2px] text-[#7152F3]'
                      : 'text-[#A2A1A8] hover:text-[#7152F3]'
                  }`}
                  onClick={() => typeof number === 'number' && paginate(number)}
                  disabled={number === '...'}
                >
                  {number}
                </button>
              ))}
              
              <button 
                className={`px-3 py-1 text-sm ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-[#A2A1A8] hover:text-[#7152F3]'}`}
                onClick={nextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <FilterModal 
          isOpen={showFilterModal} 
          onClose={() => setShowFilterModal(false)} 
          onApply={applyFilter}
        />
      )}

      {/* Add Distributor Modal */}
      {showAddModal && (
        <AddDistributorModal 
          isOpen={showAddModal} 
          onClose={() => setShowAddModal(false)} 
        />
      )}

      {/* Delete Distributor Modal */}
      {showDeleteModal && (
        <DeleteDistributorModal 
          isOpen={showDeleteModal} 
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDeleteDistributor}
          distributor={selectedDistributor}
        />
      )}
    </div>
  )
}

export default Distributors
