package com.rakshak.ai.ui

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.rakshak.ai.R

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val btnNotificationPermission = findViewById<Button>(R.id.btnGrantNotificationAccess)
        val btnOverlayPermission = findViewById<Button>(R.id.btnGrantOverlayAccess)
        val tvStatus = findViewById<TextView>(R.id.tvProtectionStatus)

        btnNotificationPermission?.setOnClickListener {
            // Open Android Notification Access settings
            val intent = Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)
            startActivity(intent)
            Toast.makeText(this, "Enable 'Rakshak AI' in notification access", Toast.LENGTH_LONG).show()
        }

        btnOverlayPermission?.setOnClickListener {
            // Open Draw Over Other Apps settings
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                if (!Settings.canDrawOverlays(this)) {
                    val intent = Intent(
                        Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                        Uri.parse("package:$packageName")
                    )
                    startActivity(intent)
                } else {
                    Toast.makeText(this, "Floating Overlay Permission already active!", Toast.LENGTH_SHORT).show()
                }
            }
        }

        updateStatus(tvStatus)
    }

    override fun onResume() {
        super.onResume()
        findViewById<TextView>(R.id.tvProtectionStatus)?.let { updateStatus(it) }
    }

    private fun updateStatus(tvStatus: TextView) {
        val hasOverlay = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            Settings.canDrawOverlays(this)
        } else true

        if (hasOverlay) {
            tvStatus.text = "🛡️ ON-DEVICE PROTECTION: ACTIVE"
            tvStatus.setTextColor(getColor(android.R.color.holo_green_light))
        } else {
            tvStatus.text = "⚠️ SETUP REQUIRED: GRANT PERMISSIONS"
            tvStatus.setTextColor(getColor(android.R.color.holo_orange_light))
        }
    }
}
