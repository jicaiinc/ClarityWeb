import {HashRouter, Routes, Route, Navigate} from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ThemedLoader } from '~components/themed-loader'
import GeneralPage from "~option/GeneralPage";

export const OptionRouter = () => {
  return (
    <Suspense fallback={<ThemedLoader />}>
      <Routes>
        <Route path="/general" element={<GeneralPage />} />
        <Route path="/" element={<Navigate to="/general" replace />} />
      </Routes>
    </Suspense>
  )
}