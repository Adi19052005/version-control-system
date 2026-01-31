const mongoose = require('mongoose');
const Repository = require('../models/repoModel');
const User = require('../models/userModel');
const Issue = require('../models/issueModel');

const createIssue = async (req, res) => {
    const { title, description, status, repoId } = req.body;

    try {
        if (!title || !description || !repoId) {
            return res
                .status(400)
                .send('Title, description, and repository ID are required to create an issue.');
        }

        const newIssue = new Issue({
            title,
            description,
            status: status || 'open',
            repository: mongoose.Types.ObjectId(repoId)
        });

        const savedIssue = await newIssue.save();

        res.status(201).json({
            message: 'Issue created successfully.',
            issue: savedIssue,
            issueId: savedIssue._id
        });

    } catch (err) {
        console.error(err);
        res
            .status(500)
            .send('Failed to create issue due to an internal server error.');
    }
};

const getAllIssues = async (req, res) => {
    try {
        const issues = await Issue.find({}).populate('repository', 'name description');
        res.status(200).json({
            message: 'Issues fetched successfully.',
            issues: issues
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to fetch issues.');
    }
};

const fetchIssueById = async (req, res) => {
    const issueId = req.params.id;
    try {
        if (!mongoose.Types.ObjectId.isValid(issueId)) {
            return res.status(400).send('Invalid issue ID format.');
        }

        const foundIssue = await Issue.findById(issueId).populate('repository', 'name description');
        if (!foundIssue) {
            return res.status(404).send('Issue not found. Please provide a valid issue ID.');
        }

        res.status(200).json({
            message: 'Issue fetched successfully.',
            issue: foundIssue
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to fetch issue due to an internal server error.');
    }
};

const updateIssueById = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('Invalid issue ID format.');
        }

        const { title, description, status } = req.body;

        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (status) updateData.status = status;

        const updatedIssue = await Issue.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedIssue) {
            return res.status(404).send('Issue not found. Please provide a valid issue ID.');
        }

        res.status(200).json({
            message: 'Issue updated successfully.',
            issue: updatedIssue
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to update issue due to an internal server error.');
    }
};

const deleteIssueById = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('Invalid issue ID format.');
        }

        const deletedIssue = await Issue.findByIdAndDelete(id);
        if (!deletedIssue) {
            return res.status(404).send('Issue not found. Please provide a valid issue ID.');
        }

        res.status(200).json({
            message: 'Issue deleted successfully.',
            issue: deletedIssue
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to delete issue due to an internal server error.');
    }
};

const toggleIssueStatus = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('Invalid issue ID format.');
        }

        const issueToToggle = await Issue.findById(id);
        if (!issueToToggle) {
            return res.status(404).send('Issue not found. Please provide a valid issue ID.');
        }

        issueToToggle.status =
            issueToToggle.status === 'open' ? 'closed' : 'open';

        const updatedIssue = await issueToToggle.save();

        res.status(200).json({
            message: 'Issue status toggled successfully.',
            issue: updatedIssue
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to toggle issue status due to an internal server error.');
    }
};

module.exports = {
    createIssue,
    getAllIssues,
    fetchIssueById,
    updateIssueById,
    deleteIssueById,
    toggleIssueStatus
};
