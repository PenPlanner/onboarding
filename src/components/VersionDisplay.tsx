import { useState } from 'react';
import { Info, X, Clock, CheckCircle, AlertTriangle, Zap } from 'lucide-react';
import { VERSION, RELEASE_NOTES } from '../config/version';

export function VersionDisplay() {
  const [showModal, setShowModal] = useState(false);

  const currentRelease = RELEASE_NOTES[VERSION as keyof typeof RELEASE_NOTES];

  return (
    <>
      {/* Version Badge */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:bg-white"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700">v{VERSION}</span>
          <Info size={16} className="text-gray-500" />
        </button>
      </div>

      {/* Release Notes Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">V</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Vestas Onboarding</h2>
                  <p className="text-sm text-gray-600">Version {VERSION}</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
              {currentRelease && (
                <div className="space-y-6">
                  {/* Release Info */}
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-blue-900">{currentRelease.title}</h3>
                      <p className="text-sm text-blue-700 flex items-center gap-2 mt-1">
                        <Clock size={14} />
                        Released on {new Date(currentRelease.date).toLocaleDateString('sv-SE')}
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  {currentRelease.features.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-5 h-5 text-green-600" />
                        <h4 className="font-semibold text-gray-900">New Features</h4>
                      </div>
                      <ul className="space-y-2">
                        {currentRelease.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Bug Fixes */}
                  {currentRelease.fixes.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                        <h4 className="font-semibold text-gray-900">Bug Fixes</h4>
                      </div>
                      <ul className="space-y-2">
                        {currentRelease.fixes.map((fix, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{fix}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Breaking Changes */}
                  {currentRelease.breaking.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                        <h4 className="font-semibold text-gray-900">Breaking Changes</h4>
                      </div>
                      <ul className="space-y-2">
                        {currentRelease.breaking.map((change, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* System Info */}
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">System Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Version:</span>
                        <span className="font-mono text-gray-900">{VERSION}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Build Date:</span>
                        <span className="font-mono text-gray-900">
                          {new Date(currentRelease.date).toLocaleDateString('sv-SE')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Environment:</span>
                        <span className="font-mono text-gray-900">Production</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Framework:</span>
                        <span className="font-mono text-gray-900">React 19</span>
                      </div>
                    </div>
                  </div>

                  {/* Support Info */}
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Support</h4>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-lg">💬</span>
                        </div>
                        <div>
                          <div className="font-medium text-blue-900">Need Help?</div>
                          <div className="text-sm text-blue-700">Contact your system administrator or IT support team for assistance with the onboarding system.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-600">
                © 2025 Vestas Wind Systems A/S
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}