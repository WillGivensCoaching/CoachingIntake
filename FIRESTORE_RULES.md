# Firebase Firestore Security Rules

Copy and paste these security rules into your Firebase Console:

**Go to:** Firebase Console → Firestore Database → Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      // Users can read their own document
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Users can create their own document on signup
      allow create: if request.auth != null && request.auth.uid == userId;
      
      // Users can update their own document (except admin status and courses)
      allow update: if request.auth != null && 
                      request.auth.uid == userId &&
                      !request.resource.data.diff(resource.data).affectedKeys().hasAny(['isAdmin', 'courses']);
      
      // Admins can read all users
      allow read: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
      
      // Admins can update any user (including courses and admin status)
      allow update: if request.auth != null && 
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

## What These Rules Do:

1. **User Read Access**: Users can only read their own profile data
2. **User Create**: New users can create their profile on signup
3. **User Update**: Users can update their profile BUT cannot change their admin status or course access (prevents self-granting)
4. **Admin Read**: Admins can view all user profiles
5. **Admin Update**: Admins can update any user's data, including granting/revoking course access

## How to Apply:

1. Open Firebase Console → Your Project
2. Go to **Firestore Database** in the left sidebar
3. Click on the **Rules** tab
4. Replace the existing rules with the above
5. Click **Publish**

## Setting Up Your First Admin:

Since you need to manually set the first admin account:

1. Go to Firebase Console → Firestore Database
2. Click on the `users` collection
3. Find your user document (by email)
4. Click "Edit document" (pencil icon)
5. Add or change the `isAdmin` field to `true`
6. Save

Now you can login at `/admin.html` and manage all other users!

## Testing:

- **As regular user**: Visit `/dashboard.html` - you should only see your courses
- **As admin**: Visit `/admin.html` - you should see all users and be able to toggle course access
- **Try to hack**: Regular users cannot change their `isAdmin` status or grant themselves courses (Firebase will reject these attempts)
