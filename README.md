# 🐾 HappyPaws Pet Adoption Portal

A beautiful, modern pet adoption management system built with **Angular 18** and **Angular Material**.

## ✨ Features

- 🎨 **Material Design UI** - Professional and beautiful interface
- 📱 **Fully Responsive** - Works perfectly on desktop, tablet, and mobile
- 🔍 **Smart Search** - Filter pets by name or breed in real-time
- 📝 **Complete CRUD** - Add, view, edit, and delete pets
- 🏷️ **Status Management** - Track availability (Available/Pending/Adopted)
- 🖼️ **Image Preview** - Live preview of pet photos in forms
- 💬 **User Feedback** - Snackbar notifications for all actions
- ⚡ **Fast & Modern** - Built with Angular 18 standalone components

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Open browser to http://localhost:4200
```

## 🏗️ Tech Stack

- **Angular** 18.2.0
- **Angular Material** 18.2.0
- **TypeScript** 5.5.2
- **RxJS** 7.8.0

## 📦 Project Structure

```
src/app/
├── components/
│   ├── pet-list/        # Browse all pets with search
│   ├── pet-form/        # Add/Edit pet form
│   └── pet-detail/      # Detailed pet view
├── models/
│   └── pet.model.ts     # Pet interface
└── services/
    └── pet.service.ts   # HTTP API service
```

## 🎨 Material Components Used

- Cards & Lists
- Form Fields & Inputs
- Buttons & Icons
- Chips & Badges
- Progress Spinners
- Snackbars (Notifications)
- Tooltips
- Dividers

## 🌐 API Configuration

Update the backend URL in `src/app/services/pet.service.ts`:

```typescript
private apiUrl = 'http://localhost:8080/api/pets';
```

## 📱 Screenshots

### Pet List View
- Grid layout with Material cards
- Search functionality
- Status chips with icons
- Quick actions (View, Adopt, Delete)

### Pet Form
- Organized sections
- Material form fields with icons
- Live image preview
- Validation with error messages

### Pet Detail View
- Large hero image
- Information grid
- Action buttons
- Status indicators

## 🔧 Development

```bash
# Run tests
npm test

# Build for production
npm run build

# Watch mode
npm run watch
```

## 📝 Features Roadmap

- [ ] Image file upload
- [ ] Material Dialog confirmations
- [ ] Advanced filters (by species, age, status)
- [ ] Pagination
- [ ] User authentication
- [ ] Favorites/Wishlist

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Made with ❤️ for pets looking for their forever homes 🏠