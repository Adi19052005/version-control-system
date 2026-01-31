const mongoose = require('mongoose');
const Repository = require('../models/repoModel');
const User = require('../models/userModel');
const issue = require('../models/issueModel');

const createRepo = async (req, res) => {
    const { userId, name, description, issues, content, visibility } = req.body;

    try {
        const user = await User.findById(mongoose.Types.ObjectId(userId));
        if (!user) {
            return res.status(404).send('User does not exist. Please provide a valid user ID.');
        }

        if (!name) {
            return res.status(400).send('Repository name is required.');
        }

        const newRepo = new Repository({
            name,
            description,
            content,
            visibility,
            owner: user._id,
            issue: issues
        });

        await newRepo.save();

        res.status(201).json({
            message: 'Repository created successfully.',
            repository: newRepo,
            repoId: newRepo._id
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to create repository due to an internal server error.');
    }
};
const getAllRepo = async (req, res) => {
    try {
        const repo = await Repository.find({})
            .populate('owner', 'username email')
            .populate('issue');

        res.status(200).json({
            message: 'Repositories fetched successfully.',
            repositories: repo
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to fetch repositories.');
    }
};

const fetchRepoById = async (req, res) => {
    const repoId = req.params.id;

    try {
        const repo = await Repository.findById(repoId)
            .populate('owner', 'username email')
            .populate('issue');

        if (!repo) {
            return res.status(404).send('Repository not found for the given ID.');
        }

        res.status(200).json({
            message: 'Repository fetched successfully.',
            repository: repo
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to fetch repository.');
    }
};
const fetchRepoByName = async (req, res) => {
    const repoName = req.params.name;

    try {
        const repo = await Repository.findOne({ name: repoName })
            .populate('owner', 'username email')
            .populate('issue');

        if (!repo) {
            return res.status(404).send('No repository found with the given name.');
        }

        res.status(200).json({
            message: 'Repository fetched successfully.',
            repository: repo
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to fetch repository by name.');
    }
};

const fetchRepoForUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        const repo = await Repository.find({ owner: userId })
            .populate('owner', 'username email')
            .populate('issue');

        if (!repo || repo.length === 0) {
            return res.status(404).send('No repositories found for the specified user.');
        }

        res.status(200).json({
            message: 'User repositories fetched successfully.',
            repositories: repo
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to fetch repositories for user.');
    }
};

const updateRepoById = async (req, res) => {
    const { id } = req.params;

    try {
        const { description, content } = req.body;

        const updatedRepo = await Repository.findByIdAndUpdate(
            id,
            { description, content },
            { new: true }
        );

        if (!updatedRepo) {
            return res.status(404).send('Repository not found. Update failed.');
        }

        res.status(200).json({
            message: 'Repository updated successfully.',
            repository: updatedRepo
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to update repository.');
    }
};
const deleteRepoById = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedRepo = await Repository.findByIdAndDelete(id);

        if (!deletedRepo) {
            return res.status(404).send('Repository not found. Deletion failed.');
        }

        res.status(200).json({
            message: 'Repository deleted successfully.'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to delete repository.');
    }
};

const toggleRepoVisibility = async (req, res) => {
    const { id } = req.params;

    try {
        const repo = await Repository.findById(id);
        if (!repo) {
            return res.status(404).send('Repository not found. Visibility toggle failed.');
        }

        repo.visibility = !repo.visibility;
        await repo.save();

        res.status(200).json({
            message: `Repository visibility changed to ${repo.visibility ? 'public' : 'private'}.`,
            repository: repo
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to toggle repository visibility.');
    }
};


module.exports = {
    createRepo,
    getAllRepo,
    fetchRepoById,
    fetchRepoByName,
    fetchRepoForUser,
    updateRepoById,
    deleteRepoById,
    toggleRepoVisibility
};