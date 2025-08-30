#!/bin/bash

echo "🚀 Setting up solid-motionone Demo..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install the local solid-motionone package
echo "🔗 Installing local solid-motionone package..."
npm install ../solid-motionone-1.1.0.tgz

echo "✅ Setup complete!"
echo ""
echo "🎯 To run the demo:"
echo "   npm run dev"
echo ""
echo "🌐 Then open: http://localhost:3000"
echo ""
echo "📚 The demo showcases all 5 phases:"
echo "   - Phase 1: Drag System"
echo "   - Phase 2: Layout Animations"
echo "   - Phase 3: Scroll Integration"
echo "   - Phase 4: Advanced Gestures"
echo "   - Phase 5: Orchestration"
