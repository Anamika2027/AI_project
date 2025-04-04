// Budget Planner Application

// Main application state
const budgetApp = {
    categories: [],
    transactions: [],
    financeTips: [
      "Create a monthly budget and stick to it to improve your financial health.",
      "Try to save at least 20% of your monthly income for future goals.",
      "Separate your wants from your needs to prioritize spending.",
      "Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings.",
      "Track your spending to identify areas where you can cut back.",
      "Consider using cash for discretionary spending to stay within budget.",
      "Pay off high-interest debt first to save money in the long run.",
      "Build an emergency fund worth 3-6 months of expenses.",
      "Review your subscriptions regularly and cancel those you don't use.",
      "Set specific, measurable financial goals to stay motivated.",
      "Automate your savings to make it easier to build wealth over time.",
      "Use the envelope budgeting system for better expense management.",
      "Negotiate your bills annually to reduce your fixed expenses.",
      "Consider meal planning to reduce food costs and minimize waste.",
      "Use cashback apps and credit cards to earn rewards on purchases."
    ],
    prefersDarkMode: false,
    achievements: {
      firstCategory: false,
      firstTransaction: false,
      savingsMaster: false
    },
    categoryIcons: {
      "fa-home": "Housing",
      "fa-utensils": "Food",
      "fa-car": "Transportation",
      "fa-shopping-bag": "Shopping",
      "fa-plane": "Travel",
      "fa-tshirt": "Clothing",
      "fa-heartbeat": "Healthcare",
      "fa-graduation-cap": "Education"
    },
    currencyRates: {},
    newsArticles: []
  };
  
  // DOM Elements
  const elements = {
    // Summary elements
    totalBudget: document.getElementById('total-budget'),
    totalExpenses: document.getElementById('total-expenses'),
    remainingBudget: document.getElementById('remaining-budget'),
    
    // Containers
    categoriesContainer: document.getElementById('categories-container'),
    transactionsContainer: document.getElementById('transactions-container'),
    noCategories: document.getElementById('no-categories'),
    noTransactions: document.getElementById('no-transactions'),
    noChartData: document.getElementById('no-chart-data'),
    achievementsContainer: document.getElementById('achievements-container'),
    newsContainer: document.getElementById('news-container'),
    
    // Finance tip element
    financeTip: document.getElementById('finance-tip'),
    
    // Modals
    categoryModal: document.getElementById('category-modal'),
    transactionModal: document.getElementById('transaction-modal'),
    apiInfoModal: document.getElementById('api-info-modal'),
    closeCategory: document.getElementById('close-category-modal'),
    closeTransaction: document.getElementById('close-transaction-modal'),
    closeApiInfo: document.getElementById('close-api-info-modal'),
    
    // Buttons
    addCategoryBtn: document.getElementById('add-category-btn'),
    addTransactionBtn: document.getElementById('add-transaction-btn'),
    cancelCategoryBtn: document.getElementById('cancel-category'),
    cancelTransactionBtn: document.getElementById('cancel-transaction'),
    newTipBtn: document.getElementById('new-tip-btn'),
    themeToggle: document.getElementById('theme-toggle'),
    convertBtn: document.getElementById('convert-btn'),
    refreshNewsBtn: document.getElementById('refresh-news'),
    
    // Forms
    categoryForm: document.getElementById('category-form'),
    transactionForm: document.getElementById('transaction-form'),
    
    // Form inputs
    categoryName: document.getElementById('category-name'),
    categoryAmount: document.getElementById('category-amount'),
    categoryColor: document.getElementById('category-color'),
    categoryIcon: document.getElementById('category-icon'),
    iconOptions: document.querySelectorAll('.icon-option'),
    
    transactionDescription: document.getElementById('transaction-description'),
    transactionAmount: document.getElementById('transaction-amount'),
    transactionCategory: document.getElementById('transaction-category'),
    transactionDate: document.getElementById('transaction-date'),
    
    // Currency converter
    convertAmount: document.getElementById('convert-amount'),
    convertFrom: document.getElementById('convert-from'),
    convertTo: document.getElementById('convert-to'),
    convertedAmount: document.getElementById('converted-amount'),
    
    // Chart
    budgetChart: document.getElementById('budget-chart')
  };
  
  // Initialize Chart.js instance
  let chart = null;
  
  // API Keys & Endpoints
  const API = {
    exchangeRate: {
      baseUrl: 'https://open.er-api.com/v6/latest/',
      key: '' // Free tier doesn't require API key
    },
    advice: {
      baseUrl: 'https://api.adviceslip.com/advice',
      key: '' // No API key required
    },
    news: {
      baseUrl: '', // Add your news API base URL here
      key: '' // Add your news API key here
    }
  };
  
  // Format number as currency
  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: currency,
      minimumFractionDigits: 2 
    }).format(amount);
  };
  
  // Load data from local storage
  const loadData = () => {
    const savedCategories = localStorage.getItem('budget_categories');
    const savedTransactions = localStorage.getItem('budget_transactions');
    const savedTheme = localStorage.getItem('budget_theme');
    const savedAchievements = localStorage.getItem('budget_achievements');
    
    if (savedCategories) {
      budgetApp.categories = JSON.parse(savedCategories);
    }
    
    if (savedTransactions) {
      budgetApp.transactions = JSON.parse(savedTransactions);
    }
    
    if (savedTheme) {
      budgetApp.prefersDarkMode = JSON.parse(savedTheme);
      if (budgetApp.prefersDarkMode) {
        document.body.classList.add('dark-mode');
        elements.themeToggle.innerHTML = '<i class="fas fa-sun mr-1"></i> Theme';
      }
    }
    
    if (savedAchievements) {
      budgetApp.achievements = JSON.parse(savedAchievements);
    }
  };
  
  // Save data to local storage
  const saveData = () => {
    localStorage.setItem('budget_categories', JSON.stringify(budgetApp.categories));
    localStorage.setItem('budget_transactions', JSON.stringify(budgetApp.transactions));
    localStorage.setItem('budget_theme', JSON.stringify(budgetApp.prefersDarkMode));
    localStorage.setItem('budget_achievements', JSON.stringify(budgetApp.achievements));
  };
  
  // Display toast notification
  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-4 py-2 rounded shadow-lg z-50 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white transform transition-all duration-500 translate-y-0 opacity-0`;
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    }, 10);
    
    // Animate out
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-20px)';
      
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 500);
    }, 3000);
  };
  
  // Show achievement
  const showAchievement = (title, description) => {
    const achievement = document.createElement('div');
    achievement.className = 'fixed bottom-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-lg z-50';
    achievement.innerHTML = `
      <div class="flex">
        <div class="flex-shrink-0">
          <i class="fas fa-trophy text-yellow-500"></i>
        </div>
        <div class="ml-3">
          <p class="font-bold">Achievement Unlocked: ${title}</p>
          <p class="text-sm">${description}</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(achievement);
    
    // Create confetti effect
    for (let i = 0; i < 20; i++) {
      createConfetti();
    }
    
    // Remove after 5 seconds
    setTimeout(() => {
      achievement.classList.add('fade-out');
      setTimeout(() => {
        document.body.removeChild(achievement);
      }, 500);
    }, 5000);
    
    // Update achievements display
    updateAchievements();
  };
  
  // Update achievements display
  const updateAchievements = () => {
    if (!elements.achievementsContainer) return;
    
    const achievements = [
      { id: 'firstCategory', title: 'Budget Creator', desc: 'Create your first budget category' },
      { id: 'firstTransaction', title: 'Transaction Tracker', desc: 'Record your first expense' },
      { id: 'savingsMaster', title: 'Savings Master', desc: 'Save 20% of your budget' }
    ];
    
    elements.achievementsContainer.innerHTML = '';
    
    achievements.forEach(achievement => {
      const isUnlocked = budgetApp.achievements[achievement.id];
      const element = document.createElement('div');
      element.className = `flex items-center p-3 ${isUnlocked ? 'bg-yellow-100' : 'bg-gray-100'} rounded-lg`;
      element.innerHTML = `
        <div class="mr-3 ${isUnlocked ? 'text-yellow-500' : 'text-gray-400'}">
          <i class="fas ${isUnlocked ? 'fa-trophy' : 'fa-lock'}"></i>
        </div>
        <div>
          <h4 class="font-medium">${achievement.title}</h4>
          <p class="text-xs text-gray-500">${achievement.desc}</p>
        </div>
      `;
      
      elements.achievementsContainer.appendChild(element);
    });
  };
  
  // Create confetti particle
  const createConfetti = () => {
    const colors = ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa'];
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    
    // Random position
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = (Math.random() * 20) + 70 + 'vh';
    
    // Random color
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Random rotation
    confetti.style.animationDuration = (Math.random() * 3 + 1) + 's';
    
    document.body.appendChild(confetti);
    
    // Remove after animation completes
    setTimeout(() => {
      document.body.removeChild(confetti);
    }, 2000);
  };
  
  // Calculate budget totals
  const calculateTotals = () => {
    // Total budget
    const totalBudget = budgetApp.categories.reduce((total, category) => {
      return total + parseFloat(category.amount);
    }, 0);
    
    // Total expenses
    const totalExpenses = budgetApp.transactions.reduce((total, transaction) => {
      return total + parseFloat(transaction.amount);
    }, 0);
    
    // Remaining budget
    const remainingBudget = totalBudget - totalExpenses;
    
    // Update summary elements
    elements.totalBudget.textContent = formatCurrency(totalBudget);
    elements.totalExpenses.textContent = formatCurrency(totalExpenses);
    elements.remainingBudget.textContent = formatCurrency(remainingBudget);
    
    // Set color based on remaining budget
    if (remainingBudget < 0) {
      elements.remainingBudget.classList.remove('text-teal-500');
      elements.remainingBudget.classList.add('text-red-500');
    } else {
      elements.remainingBudget.classList.remove('text-red-500');
      elements.remainingBudget.classList.add('text-teal-500');
    }
    
    // Check for "Savings Master" achievement
    if (remainingBudget > 0 && totalBudget > 0 && (remainingBudget / totalBudget) >= 0.2 && !budgetApp.achievements.savingsMaster) {
      budgetApp.achievements.savingsMaster = true;
      saveData();
      showAchievement('Savings Master', 'You saved at least 20% of your budget!');
    }
  };
  
  // Render categories
  const renderCategories = () => {
    // Clear existing content
    elements.categoriesContainer.innerHTML = '';
    
    if (budgetApp.categories.length === 0) {
      elements.noCategories.classList.remove('hidden');
      elements.categoriesContainer.classList.add('hidden');
      return;
    }
    
    elements.noCategories.classList.add('hidden');
    elements.categoriesContainer.classList.remove('hidden');
    
    // For each category
    budgetApp.categories.forEach((category, index) => {
      // Calculate amount spent in this category
      const spent = budgetApp.transactions
        .filter(t => t.categoryId === category.id)
        .reduce((total, t) => total + parseFloat(t.amount), 0);
      
      // Calculate percentage spent
      const percentage = category.amount > 0 ? Math.min(100, (spent / category.amount) * 100) : 0;
      
      // Create category element
      const categoryElement = document.createElement('div');
      categoryElement.className = 'category-item bg-white border rounded-lg shadow-sm p-4 hover:scale-transform';
      categoryElement.innerHTML = `
        <div class="flex justify-between items-center mb-3">
          <div class="flex items-center">
            <div class="category-icon" style="color: ${category.color}">
              <i class="fas ${category.icon || 'fa-folder'} animated-icon"></i>
            </div>
            <div>
              <h4 class="font-medium">${category.name}</h4>
              <p class="text-xs text-gray-500">${Math.round(percentage)}% spent</p>
            </div>
          </div>
          <div class="text-right">
            <div class="text-sm font-medium">${formatCurrency(spent)} / ${formatCurrency(category.amount)}</div>
            <div class="dropdown relative">
              <button class="text-gray-500 hover:text-gray-700 cursor-pointer">
                <i class="fas fa-ellipsis-v"></i>
              </button>
              <div class="dropdown-menu hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1">
                <a href="#" class="edit-category block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-index="${index}">
                  <i class="fas fa-edit mr-2"></i> Edit
                </a>
                <a href="#" class="delete-category block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-index="${index}">
                  <i class="fas fa-trash mr-2"></i> Delete
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill" style="width: ${percentage}%; background-color: ${category.color}"></div>
        </div>
      `;
      
      elements.categoriesContainer.appendChild(categoryElement);
      
      // Set up dropdown menu toggle
      const dropdown = categoryElement.querySelector('.dropdown');
      const dropdownMenu = categoryElement.querySelector('.dropdown-menu');
      
      dropdown.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropdownMenu.classList.toggle('hidden');
      });
      
      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdownMenu.classList.add('hidden');
        }
      });
      
      // Edit category handler
      const editLink = categoryElement.querySelector('.edit-category');
      editLink.addEventListener('click', (e) => {
          e.preventDefault();
          const index = parseInt(e.currentTarget.dataset.index);
          editCategory(index);
      });
      
      // Delete category handler
      const deleteLink = categoryElement.querySelector('.delete-category');
      deleteLink.addEventListener('click', (e) => {
          e.preventDefault();
          const index = parseInt(e.currentTarget.dataset.index);
          deleteCategory(index);
      });
    });
  };
  
  // Render transactions
  const renderTransactions = () => {
    // Clear existing content
    elements.transactionsContainer.innerHTML = '';
    
    if (budgetApp.transactions.length === 0) {
      elements.noTransactions.classList.remove('hidden');
      elements.transactionsContainer.classList.add('hidden');
      return;
    }
    
    elements.noTransactions.classList.add('hidden');
    elements.transactionsContainer.classList.remove('hidden');
    
    // Sort transactions by date (newest first)
    const sortedTransactions = [...budgetApp.transactions].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    
    // Get recent transactions (max 5)
    const recentTransactions = sortedTransactions.slice(0, 5);
    
    // For each transaction
    recentTransactions.forEach((transaction, index) => {
      const category = budgetApp.categories.find(c => c.id === transaction.categoryId);
      
      // Format date
      const date = new Date(transaction.date);
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      
      // Create transaction element
      const transactionElement = document.createElement('div');
      transactionElement.className = 'transaction-item flex justify-between items-center p-4 rounded-lg';
      transactionElement.innerHTML = `
        <div class="flex items-center">
          <div class="mr-3 p-2 rounded-full" style="background-color: ${category ? category.color + '30' : '#f3f4f6'}; color: ${category ? category.color : '#888'}">
            <i class="fas ${category && category.icon ? category.icon : 'fa-receipt'} animated-icon"></i>
          </div>
          <div>
            <p class="font-medium">${transaction.description}</p>
            <p class="text-xs text-gray-500">${formattedDate} • ${category ? category.name : 'Uncategorized'}</p>
          </div>
        </div>
        <div class="flex items-center">
          <span class="font-medium mr-3">${formatCurrency(transaction.amount)}</span>
          <button class="delete-transaction text-gray-400 hover:text-red-500" data-id="${transaction.id}">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `;
      
      elements.transactionsContainer.appendChild(transactionElement);
      
      // Delete transaction handler
      const deleteBtn = transactionElement.querySelector('.delete-transaction');
      deleteBtn.addEventListener('click', () => {
        deleteTransaction(transaction.id);
      });
    });
    
    // Show "View All" link if there are more transactions
    if (sortedTransactions.length > 5) {
      const viewAllLink = document.createElement('div');
      viewAllLink.className = 'text-center mt-3';
      viewAllLink.innerHTML = `
        <a href="#" class="colorful-button inline-block px-4 py-2 rounded cursor-interactive">
          View all ${sortedTransactions.length} transactions
        </a>
      `;
      elements.transactionsContainer.appendChild(viewAllLink);
    }
  };
  
  // Update category selection in transaction form
  const updateCategorySelect = () => {
    // Clear existing options (keep first placeholder option)
    while (elements.transactionCategory.options.length > 1) {
      elements.transactionCategory.remove(1);
    }
    
    // Add options for each category
    budgetApp.categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      elements.transactionCategory.appendChild(option);
    });
  };
  
  // Render budget chart
  const renderChart = () => {
    // Check if we have categories
    if (budgetApp.categories.length === 0) {
      if (elements.budgetChart) elements.budgetChart.style.display = 'none';
      if (elements.noChartData) elements.noChartData.style.display = 'block';
      return;
    }
    
    if (elements.budgetChart) elements.budgetChart.style.display = 'block';
    if (elements.noChartData) elements.noChartData.style.display = 'none';
    
    // Prepare chart data
    const labels = budgetApp.categories.map(c => c.name);
    const budgetData = budgetApp.categories.map(c => parseFloat(c.amount));
    const spentData = budgetApp.categories.map(c => {
      return budgetApp.transactions
        .filter(t => t.categoryId === c.id)
        .reduce((total, t) => total + parseFloat(t.amount), 0);
    });
    const backgroundColors = budgetApp.categories.map(c => c.color);
    
    // If chart already exists, destroy it
    if (chart) {
      chart.destroy();
    }
    
    // Create new chart
    if (elements.budgetChart) {
      chart = new Chart(elements.budgetChart, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Budget',
              data: budgetData,
              backgroundColor: backgroundColors.map(color => `${color}80`),
              borderColor: backgroundColors,
              borderWidth: 1
            },
            {
              label: 'Spent',
              data: spentData,
              backgroundColor: backgroundColors,
              borderColor: backgroundColors.map(color => `${color}DD`),
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '$' + value;
                }
              }
            }
          },
          plugins: {
            legend: {
              position: 'bottom'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': ' + formatCurrency(context.raw);
                }
              }
            }
          },
          animation: {
            duration: 1500,
            easing: 'easeInOutQuart'
          }
        }
      });
    }
  };
  
  // Add a new category
  const addCategory = (name, amount, color, icon = 'fa-folder') => {
    const newCategory = {
      id: Date.now().toString(),
      name: name,
      amount: parseFloat(amount),
      color: color,
      icon: icon
    };
    
    budgetApp.categories.push(newCategory);
    
    // Check for first category achievement
    if (budgetApp.categories.length === 1 && !budgetApp.achievements.firstCategory) {
      budgetApp.achievements.firstCategory = true;
      showAchievement('Budget Planner', 'You created your first budget category!');
    }
    
    saveData();
    renderCategories();
    updateCategorySelect();
    calculateTotals();
    renderChart();
    showToast(`Added ${name} category!`, 'success');
  };
  
  // Edit an existing category
  const editCategory = (index) => {
    const category = budgetApp.categories[index];
    
    // Populate form with category data
    elements.categoryName.value = category.name;
    elements.categoryAmount.value = category.amount;
    elements.categoryColor.value = category.color;
    elements.categoryIcon.value = category.icon || 'fa-folder';
    
    // Highlight the selected icon
    elements.iconOptions.forEach(option => {
      if (option.dataset.icon === category.icon) {
        option.classList.add('bg-gray-200', 'border-teal-500', 'border-2');
      } else {
        option.classList.remove('bg-gray-200', 'border-teal-500', 'border-2');
      }
    });
    
    // Show modal
    elements.categoryModal.classList.remove('hidden');
    
    // Update form submit handler
    elements.categoryForm.onsubmit = (e) => {
      e.preventDefault();
      
      // Update category
      category.name = elements.categoryName.value;
      category.amount = parseFloat(elements.categoryAmount.value);
      category.color = elements.categoryColor.value;
      category.icon = elements.categoryIcon.value;
      
      saveData();
      renderCategories();
      updateCategorySelect();
      calculateTotals();
      renderChart();
      
      // Hide modal
      elements.categoryModal.classList.add('hidden');
      
      showToast(`Updated ${category.name} category!`, 'success');
    };
  };
  
  // Delete a category
  const deleteCategory = (index) => {
    const confirmation = confirm('Are you sure you want to delete this category? All transactions in this category will be deleted as well.');
    
    if (confirmation) {
      const categoryId = budgetApp.categories[index].id;
      const categoryName = budgetApp.categories[index].name;
      
      // Remove category
      budgetApp.categories.splice(index, 1);
      
      // Remove transactions in this category
      budgetApp.transactions = budgetApp.transactions.filter(t => t.categoryId !== categoryId);
      
      saveData();
      renderCategories();
      renderTransactions();
      updateCategorySelect();
      calculateTotals();
      renderChart();
      
      showToast(`Deleted ${categoryName} category and its transactions.`, 'success');
    }
  };
  
  // Add a new transaction
  const addTransaction = (description, amount, categoryId, date) => {
    const newTransaction = {
      id: Date.now().toString(),
      description: description,
      amount: parseFloat(amount),
      categoryId: categoryId,
      date: date
    };
    
    budgetApp.transactions.push(newTransaction);
    
    // Check for first transaction achievement
    if (budgetApp.transactions.length === 1 && !budgetApp.achievements.firstTransaction) {
      budgetApp.achievements.firstTransaction = true;
      showAchievement('Transaction Tracker', 'You recorded your first transaction!');
    }
    
    saveData();
    renderTransactions();
    calculateTotals();
    renderChart();
    
    showToast(`Added transaction: ${description}`, 'success');
  };
  
  // Delete a transaction
  const deleteTransaction = (id) => {
    const index = budgetApp.transactions.findIndex(t => t.id === id);
    
    if (index !== -1) {
      const description = budgetApp.transactions[index].description;
      budgetApp.transactions.splice(index, 1);
      
      saveData();
      renderTransactions();
      calculateTotals();
      renderChart();
      
      showToast(`Deleted transaction: ${description}`, 'success');
    }
  };
  
  // Show a random finance tip
  const showRandomTip = () => {
    const tipIndex = Math.floor(Math.random() * budgetApp.financeTips.length);
    elements.financeTip.textContent = budgetApp.financeTips[tipIndex];
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
    budgetApp.prefersDarkMode = document.body.classList.contains('dark-mode');
    
    // Update icon
    if (budgetApp.prefersDarkMode) {
      elements.themeToggle.innerHTML = '<i class="fas fa-sun mr-1"></i> Theme';
    } else {
      elements.themeToggle.innerHTML = '<i class="fas fa-moon mr-1"></i> Theme';
    }
    
    saveData();
  };
  
  // Fetch exchange rates
  const fetchExchangeRates = async (baseCurrency = 'USD') => {
    try {
        const response = await fetch(`${API.exchangeRate.baseUrl}${baseCurrency}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch exchange rates: ${response.statusText}`);
        }
        const data = await response.json();
        if (data && data.rates) {
            budgetApp.currencyRates = data.rates;
            return data.rates;
        }
        throw new Error('Invalid exchange rate data');
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        showToast('Failed to fetch exchange rates. Please try again later.', 'error');
        return null;
    }
};
  
  // Convert currency
  const convertCurrency = () => {
    const amount = parseFloat(elements.convertAmount.value);
    const fromCurrency = elements.convertFrom.value;
    const toCurrency = elements.convertTo.value;

    // Validate input
    if (isNaN(amount) || amount <= 0) {
        showToast('Please enter a valid amount greater than 0', 'error');
        return;
    }

    if (!fromCurrency || !toCurrency) {
        showToast('Please select both currencies', 'error');
        return;
    }

    // Check if rates are available
    if (!budgetApp.currencyRates[fromCurrency] || !budgetApp.currencyRates[toCurrency]) {
        showToast('Currency rates are not available. Please try again later.', 'error');
        return;
    }

    // Calculate conversion rate
    let rate = 1;
    if (fromCurrency === 'USD') {
        rate = budgetApp.currencyRates[toCurrency];
    } else if (toCurrency === 'USD') {
        rate = 1 / budgetApp.currencyRates[fromCurrency];
    } else {
        // Convert through USD as a base currency
        const fromRate = budgetApp.currencyRates[fromCurrency];
        const toRate = budgetApp.currencyRates[toCurrency];
        rate = toRate / fromRate;
    }

    // Calculate converted amount
    const convertedAmount = amount * rate;

    // Update display
    if (elements.convertedAmount) {
        elements.convertedAmount.textContent = formatCurrency(convertedAmount, toCurrency);
    } else {
        console.error("Element with ID 'converted-amount' not found.");
    }
};
  
  // Fetch financial news
  const fetchFinancialNews = () => {
    // Mock news data for demo
    const mockNews = [
      {
        title: "Global Markets See Record Growth",
        description: "Stock indices worldwide reach all-time highs as economic recovery strengthens.",
        url: "#",
        source: "Financial Times",
        date: "2025-04-03"
      },
      {
        title: "Fed Announces Interest Rate Decision",
        description: "Federal Reserve maintains current rates citing stable inflation outlook.",
        url: "#",
        source: "Wall Street Journal",
        date: "2025-04-02"
      },
      {
        title: "New Tax Incentives for Small Businesses",
        description: "Government unveils plan to boost economy with small business tax breaks.",
        url: "#",
        source: "Bloomberg",
        date: "2025-04-01"
      },
      {
        title: "Cryptocurrency Markets Stabilize After Volatility",
        description: "Major cryptocurrencies show signs of stability following regulatory clarity.",
        url: "#",
        source: "CoinDesk",
        date: "2025-03-31"
      }
    ];
    
    budgetApp.newsArticles = mockNews;
    renderNews();
  };
  
  // Render financial news
  const renderNews = () => {
    if (!elements.newsContainer) return;
    
    elements.newsContainer.innerHTML = '';
    
    if (budgetApp.newsArticles.length === 0) {
      elements.newsContainer.innerHTML = `
        <div class="text-center p-4">
          <p class="text-gray-500">No financial news available.</p>
        </div>
      `;
      return;
    }
    
    // Display up to 4 news articles
    const articlesToShow = budgetApp.newsArticles.slice(0, 4);
    
    articlesToShow.forEach(article => {
      const date = new Date(article.date);
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      
      const articleElement = document.createElement('div');
      articleElement.className = 'p-3 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer';
      articleElement.innerHTML = `
        <h4 class="font-bold text-blue-900 mb-1">${article.title}</h4>
        <p class="text-sm text-gray-600 mb-2">${article.description}</p>
        <div class="flex justify-between items-center text-xs">
          <span class="text-blue-600">${article.source}</span>
          <span class="text-gray-500">${formattedDate}</span>
        </div>
      `;
      
      elements.newsContainer.appendChild(articleElement);
    });
  };
  
  // Fetch advice from API
  const fetchAdvice = async () => {
    try {
      const response = await fetch(API.advice.baseUrl);
      const data = await response.json();
      
      if (data && data.slip && data.slip.advice) {
        elements.financeTip.textContent = data.slip.advice;
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error fetching advice:', error);
      return false;
    }
  };
  // Fixed modal handling
const openModal = (modalElement) => {
  if (modalElement) {
    modalElement.classList.remove('hidden');
  }
};

const closeModal = (modalElement) => {
  if (modalElement) {
    modalElement.classList.add('hidden');
  }
};

  // Event listeners
  const setupEventListeners = () => {
    // Add category button
    if (elements.addCategoryBtn) {
      elements.addCategoryBtn.addEventListener('click', () => {
      // Reset form
      if (elements.categoryForm) elements.categoryForm.reset();

      // Set default color
      if (elements.categoryColor) elements.categoryColor.value = '#0d9488';
      
      // Show modal
      openModal(elements.categoryModal);
      
      // Update form submit handler
      if (elements.categoryForm) {
        elements.categoryForm.onsubmit = (e) => {
          e.preventDefault();
        
        // Add new category
        const name = elements.categoryName.value;
        const amount = elements.categoryAmount.value;
        const color = elements.categoryColor.value;
        const icon = elements.categoryIcon.value;
        
        addCategory(name, amount, color, icon);

        // Hide modal
        closeModal(elements.categoryModal);
        };
      }
    });
  }
    
    // Add transaction button
    if (elements.addTransactionBtn) {
      elements.addTransactionBtn.addEventListener('click', () => {
      // Check if we have categories
      if (budgetApp.categories.length === 0) {
        alert('Please add at least one budget category first.');
        return;
      }
      
      
      // Reset form
      if (elements.transactionForm) elements.transactionForm.reset();
      
      // Set default date to today
      const today = new Date().toISOString().split('T')[0];
      if (elements.transactionDate) elements.transactionDate.value = today;
      
      
      // Show modal
      openModal(elements.transactionModal);

      // Update form submit handler
      if (elements.transactionForm) {
        elements.transactionForm.onsubmit = (e) => {
          e.preventDefault();

        // Add new transaction
        const description = elements.transactionDescription.value;
          const amount = elements.transactionAmount.value;
          const categoryId = elements.transactionCategory.value;
          const date = elements.transactionDate.value;
          
          addTransaction(description, amount, categoryId, date);
          
        // Hide modal
        closeModal(elements.transactionModal);
      };
    }
  });
}
    // Cancel category button
    if (elements.cancelCategoryBtn) {
      elements.cancelCategoryBtn.addEventListener('click', () => {
        closeModal(elements.categoryModal);
      });
    }
    
    // Cancel transaction button
    if (elements.cancelTransactionBtn) {
      elements.cancelTransactionBtn.addEventListener('click', () => {
        closeModal(elements.transactionModal);
      });
    }
    
    // Close modals with X button
    if (elements.closeCategory) {
      elements.closeCategory.addEventListener('click', () => {
        closeModal(elements.categoryModal);
      });
    }
    
    if (elements.closeTransaction) {
      elements.closeTransaction.addEventListener('click', () => {
        closeModal(elements.transactionModal);
      });
    }
    
    if (elements.closeApiInfo) {
      elements.closeApiInfo.addEventListener('click', () => {
        closeModal(elements.apiInfoModal);
      });
    }
    
    
    // Click handlers for empty state buttons
    const emptyStateButtons = document.querySelectorAll('.empty-state button');
    emptyStateButtons.forEach(button => {
      button.addEventListener('click', () => {
        const parentElement = button.closest('.empty-state');
        if (!parentElement) return;
        
        const parentId = parentElement.id;
        
        if (parentId === 'no-categories' && elements.addCategoryBtn) {
          elements.addCategoryBtn.click();
        } else if (parentId === 'no-transactions' && elements.addTransactionBtn) {
          elements.addTransactionBtn.click();
        }
      });
    });
    
    // Icon selection in category form
    if (elements.iconOptions) {
      elements.iconOptions.forEach(option => {
        option.addEventListener('click', () => {
          // Remove selected class from all options
          elements.iconOptions.forEach(opt => {
            opt.classList.remove('bg-gray-200', 'border-teal-500', 'border-2');
          });
          // Add selected class to clicked option
          option.classList.add('bg-gray-200', 'border-teal-500', 'border-2');          
          // Set hidden input value
          if (elements.categoryIcon) elements.categoryIcon.value = option.dataset.icon;
      });
    });
  }
    // New tip button
    if (elements.newTipBtn) {
      elements.newTipBtn.addEventListener('click', () => {
        fetchAdvice().then(success => {
          if (!success) {
            showRandomTip();
          }
        });
      });
    }
    
    
    // Theme toggle
    if (elements.themeToggle) {
      elements.themeToggle.addEventListener('click', toggleDarkMode);
    }
    
    // Convert button
    if (elements.convertBtn) {
      elements.convertBtn.addEventListener('click', convertCurrency);
    }
  
    
    // Refresh news button
    if (elements.refreshNewsBtn) {
      elements.refreshNewsBtn.addEventListener('click', fetchFinancialNews);
    }
  };
  
  
  // Initialize the application
  const initApp = () => {
    try {
      loadData();
      calculateTotals();
      renderCategories();
      renderTransactions();
      updateCategorySelect();

    // Check if Chart.js is available before rendering chart
    if (typeof Chart !== 'undefined') {
      renderChart();
    } else {
      console.warn('Chart.js not loaded. Chart functionality will be disabled.');
    }
    
    updateAchievements();
    fetchFinancialNews();
    setupEventListeners();
    // Set default date in transaction form to today
    const today = new Date().toISOString().split('T')[0];
    if (elements.transactionDate) {
      elements.transactionDate.value = today;
    }
    
    // Try to fetch exchange rates
    fetchExchangeRates().then(() => {
      // Update initial conversion result if elements exist
      if (elements.convertAmount && elements.convertFrom && elements.convertTo) {
        convertCurrency();
      }
    }).catch(error => {
      console.error('Error fetching exchange rates:', error);
    });
    // Fetch a financial tip from an API
    fetchAdvice().then(success => {
      if (!success) {
        // Fallback to random tip
        showRandomTip();
      }
    }).catch(() => {
      showRandomTip();
    });
    
    // Show welcome toast on first visit
    if (!localStorage.getItem('budget_visited')) {
      localStorage.setItem('budget_visited', 'true');
      setTimeout(() => {
        showToast('Welcome to BudgetWise Explorer! Start by adding a budget category.', 'success');
      }, 1000);
    }
  } catch (error) {
    console.error('Error initializing application:', error);
    showToast('An error occurred while initializing the application.', 'error');
  }
};
  
  // Start the app when the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', initApp);

  // In your app.js or wherever your client-side JavaScript is
  function getGeminiResponse(prompt) {
    // Check if the API endpoint is configured
    const apiEndpoint = '/gemini';
    
    // Validate prompt
    if (!prompt || typeof prompt !== 'string') {
      console.error('Invalid prompt for Gemini API');
      updateGeminiOutput('Error: Invalid prompt');
      return;
    }
    
    fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: prompt }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Gemini Response:', data);
      const output = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
      updateGeminiOutput(output);
    })
    .catch(error => {
      console.error('Error fetching from server:', error);
      updateGeminiOutput('Error: Unable to fetch response.');
    });
  }
  
  
  // Helper function to update Gemini output
  function updateGeminiOutput(message) {
    const outputElement = document.getElementById('gemini-output');
    if (outputElement) {
      outputElement.innerHTML = `<p><strong>Gemini says:</strong> ${message}</p>`;
    } else {
      console.error('Gemini output element not found');
    }
  }