# BDU Backend API Documentation

## 📋 Ümumi Baxış

Bu dokumentasiya BDU website üçün Node.js + Express backend API-nin strukturunu təsvir edir.

## 🛠️ Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer
- **Validation**: Joi
- **Image Processing**: Sharp
- **Security**: Helmet, CORS, express-rate-limit

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   ├── cloudinary.js        # Image upload config
│   │   └── jwt.js               # JWT config
│   ├── models/
│   │   ├── Page.js              # Page model
│   │   ├── Menu.js              # Menu model
│   │   ├── User.js              # Admin user model
│   │   └── Media.js             # Media library model
│   ├── controllers/
│   │   ├── pageController.js    # Page CRUD
│   │   ├── menuController.js    # Menu CRUD
│   │   ├── authController.js    # Authentication
│   │   └── mediaController.js   # Media management
│   ├── routes/
│   │   ├── api/
│   │   │   ├── pages.js         # Public API routes
│   │   │   └── menu.js          # Menu API routes
│   │   └── admin/
│   │       ├── pages.js         # Admin page routes
│   │       ├── menu.js          # Admin menu routes
│   │       ├── auth.js          # Admin auth routes
│   │       └── media.js         # Admin media routes
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── validate.js          # Request validation
│   │   ├── upload.js            # File upload
│   │   └── errorHandler.js     # Error handling
│   ├── utils/
│   │   ├── urlSlugify.js        # URL slug generator
│   │   ├── imageOptimizer.js   # Image optimization
│   │   └── cache.js             # Redis cache
│   └── app.js                   # Express app
├── .env
├── .env.example
└── package.json
```

## 🗄️ Database Models

### 1. Page Model

```javascript
// src/models/Page.js
const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema({
  // Unique identifier
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Category (multilanguage)
  category: {
    az: {
      type: String,
      required: true,
      enum: ['universitet', 'tehsil', 'elm', 'sosial', 'emekdasliq']
    },
    en: {
      type: String,
      required: true,
      enum: ['university', 'education', 'science', 'social', 'cooperation']
    }
  },
  
  // Slug (multilanguage)
  slug: {
    az: [String],
    en: [String]
  },
  
  // Full path (multilanguage)
  fullPath: {
    az: {
      type: String,
      required: true,
      index: true
    },
    en: {
      type: String,
      required: true,
      index: true
    }
  },
  
  // Content (multilanguage)
  content: {
    az: {
      title: { type: String, required: true },
      description: String,
      body: String,
      seo: {
        metaTitle: String,
        metaDescription: String,
        keywords: [String]
      }
    },
    en: {
      title: { type: String, required: true },
      description: String,
      body: String,
      seo: {
        metaTitle: String,
        metaDescription: String,
        keywords: [String]
      }
    }
  },
  
  // Page type
  type: {
    az: {
      type: String,
      enum: ['səhifə', 'bloq', 'siyahı', 'arxiv'],
      default: 'səhifə'
    },
    en: {
      type: String,
      enum: ['page', 'blog', 'list', 'archive'],
      default: 'page'
    }
  },
  
  // Sidebar navigation
  sidebar: {
    show: { type: Boolean, default: true },
    items: [{
      label: {
        az: String,
        en: String
      },
      href: {
        az: String,
        en: String
      },
      children: [{
        label: {
          az: String,
          en: String
        },
        href: {
          az: String,
          en: String
        },
        children: [{
          label: {
            az: String,
            en: String
          },
          href: {
            az: String,
            en: String
          }
        }]
      }]
    }]
  },
  
  // Sub-pages
  subPages: [{
    id: String,
    title: {
      az: String,
      en: String
    },
    description: {
      az: String,
      en: String
    },
    href: {
      az: String,
      en: String
    },
    thumbnail: String
  }],
  
  // For blog/archive pages
  items: [{
    id: String,
    date: Date,
    title: {
      az: String,
      en: String
    },
    excerpt: {
      az: String,
      en: String
    },
    href: {
      az: String,
      en: String
    },
    image: String
  }],
  
  // Page settings
  settings: {
    showBreadcrumbs: { type: Boolean, default: true },
    showSidebar: { type: Boolean, default: true },
    showSubPages: { type: Boolean, default: true },
    showRelatedContent: { type: Boolean, default: false },
    template: {
      type: String,
      enum: ['default', 'blog', 'archive', 'custom'],
      default: 'default'
    }
  },
  
  // Publish status
  status: {
    type: String,
    enum: ['published', 'draft', 'archived'],
    default: 'draft',
    index: true
  },
  
  // Author
  author: {
    name: {
      az: String,
      en: String
    },
    role: {
      az: String,
      en: String
    }
  },
  
  // Timestamps
  publishedAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Indexes for performance
PageSchema.index({ 'fullPath.az': 1 });
PageSchema.index({ 'fullPath.en': 1 });
PageSchema.index({ status: 1, publishedAt: -1 });
PageSchema.index({ 'category.az': 1, status: 1 });

// Virtual for URL
PageSchema.virtual('url').get(function() {
  return {
    az: this.fullPath.az,
    en: this.fullPath.en
  };
});

module.exports = mongoose.model('Page', PageSchema);
```

### 2. Menu Model

```javascript
// src/models/Menu.js
const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  id: String,
  label: {
    az: String,
    en: String
  },
  href: {
    az: String,
    en: String
  },
  description: {
    az: String,
    en: String
  },
  subitems: [this],
  order: { type: Number, default: 0 }
}, { _id: false });

const MenuSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  label: {
    az: { type: String, required: true },
    en: { type: String, required: true }
  },
  type: {
    type: String,
    enum: ['mega', 'dropdown', 'link'],
    default: 'mega'
  },
  columns: [{
    title: {
      az: String,
      en: String
    },
    items: [MenuItemSchema],
    order: { type: Number, default: 0 }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  order: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Menu', MenuSchema);
```

### 3. User Model (Admin)

```javascript
// src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  fullName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['super-admin', 'admin', 'editor', 'viewer'],
    default: 'editor'
  },
  permissions: [{
    type: String,
    enum: ['pages.create', 'pages.edit', 'pages.delete', 'pages.publish', 
           'menu.edit', 'media.upload', 'users.manage']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Hash password before save
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
UserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
```

### 4. Media Model

```javascript
// src/models/Media.js
const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  thumbnailUrl: String,
  alt: {
    az: String,
    en: String
  },
  caption: {
    az: String,
    en: String
  },
  folder: {
    type: String,
    default: 'general'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

MediaSchema.index({ folder: 1, createdAt: -1 });

module.exports = mongoose.model('Media', MediaSchema);
```

## 🔌 API Routes

### Public API Routes

#### 1. Get Page by Path
```http
GET /api/pages/:category/:slug*
Query: ?locale=az
Response: Page object
```

#### 2. Get Pages by Category
```http
GET /api/pages/category/:category
Query: ?locale=az&status=published&limit=10&page=1
Response: { pages: [], total: 0, page: 1, limit: 10 }
```

#### 3. Search Pages
```http
GET /api/pages/search
Query: ?q=elmi&locale=az&limit=10
Response: { results: [], total: 0 }
```

#### 4. Get Menu
```http
GET /api/menu/:menuId
Query: ?locale=az
Response: Menu object
```

#### 5. Get All Menus
```http
GET /api/menu
Query: ?locale=az&status=active
Response: Menu[] array
```

### Admin API Routes

#### Authentication

```http
POST /admin/auth/login
Body: { username, password }
Response: { token, user }

POST /admin/auth/refresh
Headers: Authorization: Bearer <token>
Response: { token }

GET /admin/auth/me
Headers: Authorization: Bearer <token>
Response: User object
```

#### Pages Management

```http
GET /admin/pages
Query: ?status=all&category=university&page=1&limit=20
Response: { pages: [], total: 0, page: 1 }

GET /admin/pages/:id
Response: Page object

POST /admin/pages
Body: Page object
Response: { page, message }

PUT /admin/pages/:id
Body: Partial Page object
Response: { page, message }

DELETE /admin/pages/:id
Response: { message }

PATCH /admin/pages/:id/publish
Response: { page, message }

PATCH /admin/pages/:id/unpublish
Response: { page, message }
```

#### Menu Management

```http
GET /admin/menu
Response: Menu[] array

GET /admin/menu/:id
Response: Menu object

PUT /admin/menu/:id
Body: Menu object
Response: { menu, message }

POST /admin/menu/:id/reorder
Body: { order: number }
Response: { menu, message }
```

#### Media Management

```http
GET /admin/media
Query: ?folder=general&page=1&limit=20
Response: { media: [], total: 0 }

POST /admin/media/upload
Body: FormData with file
Response: { media, message }

PUT /admin/media/:id
Body: { alt, caption, folder }
Response: { media, message }

DELETE /admin/media/:id
Response: { message }
```

#### User Management

```http
GET /admin/users
Response: User[] array

POST /admin/users
Body: { username, email, password, fullName, role }
Response: { user, message }

PUT /admin/users/:id
Body: Partial User object
Response: { user, message }

DELETE /admin/users/:id
Response: { message }
```

## 📄 Controller Examples

### Page Controller

```javascript
// src/controllers/pageController.js
const Page = require('../models/Page');
const { translateSlug } = require('../utils/urlSlugify');

// Get page by path
exports.getPageByPath = async (req, res, next) => {
  try {
    const { category, slug } = req.params;
    const { locale = 'az' } = req.query;
    
    // Build full path
    const slugArray = slug ? slug.split('/') : [];
    const fullPath = `/${category}/${slugArray.join('/')}`;
    
    // Find page
    const page = await Page.findOne({
      [`fullPath.${locale}`]: fullPath,
      status: 'published'
    });
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }
    
    res.json({
      success: true,
      data: page
    });
  } catch (error) {
    next(error);
  }
};

// Get pages by category
exports.getPagesByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { locale = 'az', status = 'published', page = 1, limit = 10 } = req.query;
    
    const query = {
      [`category.${locale}`]: category,
      status
    };
    
    const pages = await Page.find(query)
      .sort({ publishedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const count = await Page.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        pages,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Search pages
exports.searchPages = async (req, res, next) => {
  try {
    const { q, locale = 'az', limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const pages = await Page.find({
      $or: [
        { [`content.${locale}.title`]: { $regex: q, $options: 'i' } },
        { [`content.${locale}.description`]: { $regex: q, $options: 'i' } },
        { [`content.${locale}.body`]: { $regex: q, $options: 'i' } }
      ],
      status: 'published'
    })
    .limit(limit * 1)
    .select(`content.${locale}.title content.${locale}.description fullPath.${locale}`)
    .exec();
    
    res.json({
      success: true,
      data: {
        results: pages,
        total: pages.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Create page
exports.createPage = async (req, res, next) => {
  try {
    const pageData = req.body;
    
    // Generate unique ID if not provided
    if (!pageData.id) {
      pageData.id = `page-${Date.now()}`;
    }
    
    // Create page
    const page = new Page(pageData);
    await page.save();
    
    res.status(201).json({
      success: true,
      data: page,
      message: 'Page created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update page
exports.updatePage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const page = await Page.findOneAndUpdate(
      { id },
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }
    
    res.json({
      success: true,
      data: page,
      message: 'Page updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete page
exports.deletePage = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const page = await Page.findOneAndDelete({ id });
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Page deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Publish page
exports.publishPage = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const page = await Page.findOneAndUpdate(
      { id },
      { 
        status: 'published',
        publishedAt: Date.now()
      },
      { new: true }
    );
    
    if (!page) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }
    
    res.json({
      success: true,
      data: page,
      message: 'Page published successfully'
    });
  } catch (error) {
    next(error);
  }
};
```

### Auth Controller

```javascript
// src/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }
    
    // Find user
    const user = await User.findOne({ username, isActive: true });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Update last login
    user.lastLogin = Date.now();
    await user.save();
    
    // Generate token
    const token = generateToken(user._id);
    
    res.json({
      success: true,
      data: {
        token,
        user: user.toJSON()
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Refresh token
exports.refreshToken = async (req, res, next) => {
  try {
    const token = generateToken(req.user.id);
    
    res.json({
      success: true,
      data: { token }
    });
  } catch (error) {
    next(error);
  }
};
```

## 🔒 Middleware

### Auth Middleware

```javascript
// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    const user = await User.findById(decoded.id);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Check permissions
exports.authorize = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    // Super admin has all permissions
    if (req.user.role === 'super-admin') {
      return next();
    }
    
    // Check if user has required permission
    const hasPermission = permissions.some(permission => 
      req.user.permissions.includes(permission)
    );
    
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to perform this action'
      });
    }
    
    next();
  };
};
```

## 🚀 Environment Variables

```env
# .env.example
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/bdu
MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/bdu

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Redis (optional - for caching)
REDIS_HOST=localhost
REDIS_PORT=6379

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📦 Package.json

```json
{
  "name": "bdu-backend",
  "version": "1.0.0",
  "description": "BDU Website Backend API",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "seed": "node src/scripts/seed.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.10.0",
    "multer": "^1.4.5-lts.1",
    "sharp": "^0.32.5",
    "joi": "^17.10.0",
    "dotenv": "^16.3.1",
    "cloudinary": "^1.40.0",
    "redis": "^4.6.8",
    "compression": "^1.7.4",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

## 🎯 Next Steps

1. **Setup Project**: `npm install`
2. **Configure Environment**: Copy `.env.example` to `.env`
3. **Start MongoDB**: `mongod`
4. **Run Migrations**: Create initial admin user
5. **Start Server**: `npm run dev`
6. **Test API**: Use Postman/Insomnia
7. **Deploy**: Setup production environment

## 📚 Additional Resources

- API Testing: Use Postman collection (create separate)
- Admin Panel: React/Next.js admin dashboard
- Documentation: Swagger/OpenAPI spec
- Monitoring: PM2, Winston logging
- Backup: MongoDB backup strategy
