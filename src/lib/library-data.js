// סימולציה של מבנה הספרייה - במציאות יגיע מ-API/Database
export const libraryStructure = [
  {
    id: '1',
    name: 'תנ"ך',
    type: 'folder',
    children: [
      {
        id: '1-1',
        name: 'תורה',
        type: 'folder',
        children: [
          { id: '1-1-1', name: 'בראשית', type: 'file', status: 'completed', lastEdit: '2024-11-20', editor: 'משה כהן' },
          { id: '1-1-2', name: 'שמות', type: 'file', status: 'completed', lastEdit: '2024-11-18', editor: 'דוד לוי' },
          { id: '1-1-3', name: 'ויקרא', type: 'file', status: 'in-progress', lastEdit: '2024-11-22', editor: 'שרה אברהם' },
          { id: '1-1-4', name: 'במדבר', type: 'file', status: 'available', lastEdit: null, editor: null },
          { id: '1-1-5', name: 'דברים', type: 'file', status: 'completed', lastEdit: '2024-11-15', editor: 'יוסף כהן' },
        ]
      },
      {
        id: '1-2',
        name: 'נביאים',
        type: 'folder',
        children: [
          { id: '1-2-1', name: 'יהושע', type: 'file', status: 'completed', lastEdit: '2024-11-10', editor: 'רחל מזרחי' },
          { id: '1-2-2', name: 'שופטים', type: 'file', status: 'in-progress', lastEdit: '2024-11-23', editor: 'אברהם ישראל' },
          { id: '1-2-3', name: 'שמואל א', type: 'file', status: 'available', lastEdit: null, editor: null },
          { id: '1-2-4', name: 'שמואל ב', type: 'file', status: 'available', lastEdit: null, editor: null },
        ]
      },
      {
        id: '1-3',
        name: 'כתובים',
        type: 'folder',
        children: [
          { id: '1-3-1', name: 'תהילים', type: 'file', status: 'completed', lastEdit: '2024-11-19', editor: 'מרים כהן' },
          { id: '1-3-2', name: 'משלי', type: 'file', status: 'in-progress', lastEdit: '2024-11-24', editor: 'יעקב לוי' },
          { id: '1-3-3', name: 'איוב', type: 'file', status: 'available', lastEdit: null, editor: null },
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'משנה',
    type: 'folder',
    children: [
      {
        id: '2-1',
        name: 'זרעים',
        type: 'folder',
        children: [
          { id: '2-1-1', name: 'ברכות', type: 'file', status: 'completed', lastEdit: '2024-11-21', editor: 'חיים כהן' },
          { id: '2-1-2', name: 'פאה', type: 'file', status: 'in-progress', lastEdit: '2024-11-23', editor: 'שמעון לוי' },
          { id: '2-1-3', name: 'דמאי', type: 'file', status: 'available', lastEdit: null, editor: null },
        ]
      },
      {
        id: '2-2',
        name: 'מועד',
        type: 'folder',
        children: [
          { id: '2-2-1', name: 'שבת', type: 'file', status: 'completed', lastEdit: '2024-11-17', editor: 'אליהו כהן' },
          { id: '2-2-2', name: 'עירובין', type: 'file', status: 'in-progress', lastEdit: '2024-11-22', editor: 'דניאל אברהם' },
          { id: '2-2-3', name: 'פסחים', type: 'file', status: 'available', lastEdit: null, editor: null },
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'תלמוד בבלי',
    type: 'folder',
    children: [
      { id: '3-1', name: 'ברכות', type: 'file', status: 'in-progress', lastEdit: '2024-11-24', editor: 'משה רבינוביץ' },
      { id: '3-2', name: 'שבת', type: 'file', status: 'available', lastEdit: null, editor: null },
      { id: '3-3', name: 'עירובין', type: 'file', status: 'available', lastEdit: null, editor: null },
    ]
  },
  {
    id: '4',
    name: 'הלכה',
    type: 'folder',
    children: [
      {
        id: '4-1',
        name: 'משנה תורה',
        type: 'folder',
        children: [
          { id: '4-1-1', name: 'ספר המדע', type: 'file', status: 'completed', lastEdit: '2024-11-16', editor: 'יצחק כהן' },
          { id: '4-1-2', name: 'ספר אהבה', type: 'file', status: 'in-progress', lastEdit: '2024-11-23', editor: 'אהרן לוי' },
        ]
      },
      {
        id: '4-2',
        name: 'שולחן ערוך',
        type: 'folder',
        children: [
          { id: '4-2-1', name: 'אורח חיים', type: 'file', status: 'completed', lastEdit: '2024-11-14', editor: 'שלמה כהן' },
          { id: '4-2-2', name: 'יורה דעה', type: 'file', status: 'available', lastEdit: null, editor: null },
        ]
      }
    ]
  }
]

export const statusConfig = {
  completed: {
    label: 'הושלם',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
    icon: 'check_circle'
  },
  'in-progress': {
    label: 'בטיפול',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
    icon: 'edit'
  },
  available: {
    label: 'זמין לעריכה',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300',
    icon: 'description'
  }
}

// פונקציה לחיפוש בעץ
export function searchInTree(tree, searchTerm) {
  if (!searchTerm) return tree
  
  const results = []
  
  function search(items, path = []) {
    items.forEach(item => {
      const currentPath = [...path, item.name]
      
      if (item.name.includes(searchTerm)) {
        results.push({ ...item, path: currentPath })
      }
      
      if (item.children) {
        search(item.children, currentPath)
      }
    })
  }
  
  search(tree)
  return results
}

// פונקציה לספירת קבצים לפי סטטוס
export function countByStatus(tree) {
  const counts = { completed: 0, 'in-progress': 0, available: 0 }
  
  function count(items) {
    items.forEach(item => {
      if (item.type === 'file' && item.status) {
        counts[item.status]++
      }
      if (item.children) {
        count(item.children)
      }
    })
  }
  
  count(tree)
  return counts
}
