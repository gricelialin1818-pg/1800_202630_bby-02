// vite.config.js
// Tells Vite's bundler (Rollup) that each of these HTML files is a page of its own.
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                index:    resolve(__dirname, "index.html"),
                login:    resolve(__dirname, "login.html"),
                main:     resolve(__dirname, "main-goals-listed.html"),
                achievements: resolve(__dirname, "achievements.html"),
                addGoalDetails:  resolve(__dirname, "add-goal-details.html"),
                autoUpdate: resolve(__dirname, "auto-update.html"),
                addGoalScreen:  resolve(__dirname, "add-goal-screen.html"),
                comments: resolve(__dirname, "comments.html"),
                comfirmPost:  resolve(__dirname, "confirm-post.html"),
                deadline: resolve(__dirname, "deadline.html"),
                goalDetails:  resolve(__dirname, "goal-details.html"),
                personalPosts: resolve(__dirname, "personal-posts.html"),
                postDetails:  resolve(__dirname, "post-details.html"),
                privacy: resolve(__dirname, "privacy.html"),
                reward:  resolve(__dirname, "reward.html"),
                selectGoalToPost: resolve(__dirname, "select-goal-to-post.html"),
                social:  resolve(__dirname, "social.html"),
                successfulGoal: resolve(__dirname, "successful-goal.html"),
                updateProgress:  resolve(__dirname, "update-progress.html")
            }
        }
    }
});