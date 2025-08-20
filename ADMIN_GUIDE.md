# Admin Dashboard Guide - Govindam Nursery

## Overview
The Admin Dashboard provides comprehensive management tools for customer data, certificate generation, and email notifications.

## Features

### 1. Customer Data Management
- **CSV Upload**: Import customer data from CSV files
- **Manual Entry**: Add customers individually through forms
- **Data Export**: Download customer data as CSV
- **Customer Table**: View and manage all customer records

### 2. Certificate Generation
- **Individual Certificates**: Generate certificates for specific customers
- **Bulk Generation**: Generate certificates for all pending customers
- **Certificate Download**: Automatically download generated certificates
- **Unique IDs**: Each certificate gets a unique identifier

### 3. Email Notifications
- **Email Configuration**: Set up SMTP settings and email templates
- **Individual Emails**: Send emails to specific customers
- **Bulk Emails**: Send notifications to all customers with email addresses
- **Template Variables**: Use placeholders like {{name}}, {{plantCount}}, {{carbonOffset}}

### 4. Statistics Dashboard
- Total Customers
- Total Plants Sold
- Total Carbon Offset (kg)
- Pending Certificates

## Usage Instructions

### Setting Up Customer Data

#### Option 1: CSV Upload
1. Prepare a CSV file with columns: Name, Phone, Email, Purchase_Details, Purchase_Date, Plant_Count, Carbon_Offset_kg, Status
2. Click "Choose CSV File" and select your file
3. Click "Process CSV Data" to import
4. Review imported data in the customer table

#### Option 2: Manual Entry
1. Fill out the customer form with required information
2. Click "Add Customer" to save
3. Customer will appear in the table with "Pending" status

### Generating Certificates

#### Individual Certificate
1. Find the customer in the table
2. Click "Certificate" button in the Actions column
3. Certificate will be generated and downloaded automatically
4. Customer status updates to "Certificate Generated"

#### Bulk Certificates
1. Click "Generate All Certificates" button
2. Certificates will be generated for all pending customers
3. Each certificate downloads automatically

### Sending Email Notifications

#### Email Configuration
1. Enter SMTP email and password
2. Customize email template using placeholders
3. Click "Save Email Configuration"

#### Sending Emails
1. **Individual**: Click "Email" button for specific customers
2. **Bulk**: Click "Send All Email Notifications"
3. Customer status updates to "Email Sent"

### Data Management

#### Export Data
- Click "Export Data" to download current customer data as CSV
- Includes all customer information and status updates

#### Delete Customers
- Click trash icon in Actions column
- Confirm deletion in popup dialog

## File Structure

```
├── admin.html          # Admin dashboard interface
├── js/admin.js         # Admin functionality
├── customer_data.csv   # Sample customer data
└── ADMIN_GUIDE.md      # This guide
```

## Technical Details

### Data Storage
- Customer data stored in browser localStorage
- Email configuration saved locally
- Data persists between sessions

### Certificate Generation
- Certificates generated as HTML files
- Include security features (watermarks, borders)
- Professional design with company branding

### Email System
- Currently simulates email sending
- Ready for integration with email services (SendGrid, AWS SES, etc.)
- Template-based system for consistency

## Security Features

### Certificate Security
- Unique certificate IDs
- Watermark overlays
- Security borders
- Verification status tracking

### Data Protection
- Local storage (no external data transmission)
- Input validation
- Confirmation dialogs for destructive actions

## Integration Possibilities

### Email Services
- SendGrid
- AWS SES
- Mailgun
- SMTP servers

### Database Systems
- MySQL/PostgreSQL
- MongoDB
- Firebase
- AWS DynamoDB

### Cloud Storage
- AWS S3
- Google Cloud Storage
- Azure Blob Storage

## Troubleshooting

### Common Issues

1. **CSV Import Errors**
   - Check CSV format and column headers
   - Ensure proper comma separation
   - Verify data types match expected format

2. **Certificate Generation Fails**
   - Check browser download settings
   - Ensure customer data is complete
   - Verify JavaScript console for errors

3. **Email Notifications**
   - Check email configuration
   - Verify customer email addresses
   - Review browser console for errors

### Browser Compatibility
- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (limited functionality)

## Future Enhancements

### Planned Features
- User authentication and roles
- Advanced reporting and analytics
- Integration with payment systems
- Customer portal access
- Automated certificate scheduling
- Advanced email templates
- Data backup and restore

### API Integration
- RESTful API endpoints
- Webhook support
- Third-party integrations
- Mobile app support

## Support

For technical support or feature requests, contact the development team or refer to the main website documentation.

---

**Note**: This admin interface is designed for internal use by Govindam Nursery staff. Ensure proper access controls and data security measures are in place for production use.
