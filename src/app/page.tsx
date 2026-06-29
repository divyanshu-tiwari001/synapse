'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Brain, MessageSquare, Upload, Trophy, Zap, Shield, ChevronRight } from 'lucide-react'

const features = [
  {
    icon: <MessageSquare className="w-6 h-6 text-blue-400" />,
    title: 'AI-Powered Chat',
    description: 'Ask anything about your study material. Get instant, contextual answers powered by GPT-4.',
    color: 'from-blue-600/20 to-blue-800/20 border-blue-500/20',
  },
  {
    icon: <Upload className="w-6 h-6 text-purple-400" />,
    title: 'Smart Upload',
    description: 'Upload PDFs and textbooks. Our RAG pipeline indexes and makes them searchable instantly.',
    color: 'from-purple-600/20 to-purple-800/20 border-purple-500/20',
  },
  {
    icon: <Trophy className="w-6 h-6 text-yellow-400" />,
    title: 'Adaptive Quizzes',
    description: 'Generate custom quizzes on any topic at any difficulty. Track your weak areas automatically.',
    color: 'from-yellow-600/20 to-orange-800/20 border-yellow-500/20',
  },
  {
    icon: <Zap className="w-6 h-6 text-emerald-400" />,
    title: 'Instant Answers',
    description: 'Streaming responses so you never wait. Get explanations with full LaTeX math support.',
    color: 'from-emerald-600/20 to-teal-800/20 border-emerald-500/20',
  },
  {
    icon: <Brain className="w-6 h-6 text-pink-400" />,
    title: 'Personalized Learning',
    description: 'Study streaks, progress tracking, and weak-topic identification tailored to your goals.',
    color: 'from-pink-600/20 to-rose-800/20 border-pink-500/20',
  },
  {
    icon: <Shield className="w-6 h-6 text-cyan-400" />,
    title: 'Secure & Private',
    description: 'Your study data is encrypted and private. No data shared with third parties.',
    color: 'from-cyan-600/20 to-sky-800/20 border-cyan-500/20',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full bg-purple-600/10 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Synapse
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">
            Sign in
          </Link>
          <Link href="/signup" className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white transition-all">
            Get started
          </Link>
        </div>
      </nav>

      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-20 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-8">
            <Zap className="w-3 h-3" />
            Powered by GPT-4 and RAG
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            Study smarter with{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
            Synapse is your AI-powered study companion for JEE, NEET, and CBSE. Upload your notes,
            chat with an AI tutor, and generate adaptive quizzes — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="group inline-flex items-center gap-2 px-6 py-3 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/25 transition-all duration-200">
              Start for free
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium rounded-xl backdrop-blur-md bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-200">
              Sign in
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 px-6 md:px-12 pb-24 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className={`rounded-2xl p-6 backdrop-blur-md bg-gradient-to-br border ${f.color} space-y-3`}
            >
              <div className="w-10 h-10 rounded-lg bg-black/20 flex items-center justify-center">
                {f.icon}
              </div>
              <h3 className="font-semibold text-white">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="relative z-10 px-6 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-2xl mx-auto rounded-3xl p-10 backdrop-blur-md bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20"
        >
          <h2 className="text-3xl font-bold text-white mb-3">Ready to ace your exams?</h2>
          <p className="text-gray-400 mb-8">Join students already using Synapse to prepare smarter.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/25 transition-all duration-200">
            Get started free
            <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>
    </main>
  )
}
